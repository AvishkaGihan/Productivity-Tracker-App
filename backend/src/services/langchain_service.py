"""
LangChain service for AI-powered task suggestions using Google Gemini API
Handles context retrieval, prompt construction, and AI response parsing
"""

import json
import logging
import os
import re
from typing import List

from langchain_core.output_parsers import JsonOutputParser
from langchain_core.prompts import PromptTemplate

# LangChain imports
from langchain_google_genai import ChatGoogleGenerativeAI
from sqlalchemy.orm import Session

from src.repository.repositories import UserRepository
from src.schemas import AISuggestionResponse, SuggestedTask

logger = logging.getLogger(__name__)

# Initialize Gemini LLM
GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")

if not GOOGLE_API_KEY:
    logger.warning("GOOGLE_API_KEY not set in environment variables")


# ============================================================================
# PROMPT TEMPLATES
# ============================================================================

TASK_SUGGESTION_TEMPLATE = """
You are an intelligent productivity assistant. Based on the user's goals and notes,
generate actionable task suggestions.

User's Goals:
{goals}

User's Notes:
{notes}

User's Query:
{query}

Please generate 3-5 specific, actionable task suggestions that align with the user's goals and context.

IMPORTANT: Return ONLY a valid JSON array. Do not include any other text, explanations, or markdown.
Escape all special characters properly (quotes, newlines, etc.).

Expected JSON format:
[
  {{"title": "Task title here", "reason": "Why this task aligns with their goals"}},
  {{"title": "Another task", "reason": "Reason for this task"}},
  {{"title": "Third task", "reason": "Another reason"}}
]

Return only the JSON array, nothing else.
"""

# ============================================================================
# LANGCHAIN SERVICE
# ============================================================================


class LangChainService:
    """Service for LangChain-based AI task suggestions"""

    def __init__(self):
        """Initialize LangChain with Gemini API"""
        self.model_name = "gemini-2.5-flash"
        self.temperature = 0.7
        self.llm = None
        self.parser = JsonOutputParser()

        if GOOGLE_API_KEY:
            try:
                self.llm = ChatGoogleGenerativeAI(
                    model=self.model_name,
                    api_key=GOOGLE_API_KEY,
                    temperature=self.temperature,
                    max_output_tokens=1024,
                    timeout=30,
                )
                logger.info(f"LangChain initialized with {self.model_name}")
            except Exception as e:
                logger.error(f"Error initializing LangChain: {str(e)}")
                self.llm = None

    def _parse_ai_response(self, response_text: str) -> List[SuggestedTask]:
        """
        Parse AI response into structured task suggestions

        Args:
            response_text: Raw response from Gemini API

        Returns:
            List of SuggestedTask objects
        """
        try:
            # Try to extract JSON from response
            # Remove markdown code blocks if present
            if "```json" in response_text:
                response_text = response_text.split("```json")[1].split("```")[0]
            elif "```" in response_text:
                response_text = response_text.split("```")[1].split("```")[0]

            response_text = response_text.strip()

            # Parse JSON with strict=False to be more lenient
            suggestions_data = json.loads(response_text, strict=False)

            # Ensure it's a list
            if not isinstance(suggestions_data, list):
                suggestions_data = [suggestions_data]

            # Convert to SuggestedTask objects
            suggestions = []
            for item in suggestions_data:
                if isinstance(item, dict) and "title" in item:
                    suggestion = SuggestedTask(
                        title=item.get("title", ""), reason=item.get("reason", "")
                    )
                    if suggestion.title:
                        suggestions.append(suggestion)

            return suggestions

        except json.JSONDecodeError as e:
            logger.error(f"Error parsing AI response as JSON: {str(e)}")
            logger.debug(f"Raw response: {response_text}")

            # Fallback: Try to extract task suggestions using regex as a last resort
            return self._fallback_parse(response_text)
        except Exception as e:
            logger.error(f"Error parsing AI response: {str(e)}")
            return []

    def _fallback_parse(self, response_text: str) -> List[SuggestedTask]:
        """
        Fallback parser when JSON parsing fails
        Attempts to extract task information using pattern matching

        Args:
            response_text: Raw response text

        Returns:
            List of SuggestedTask objects
        """
        suggestions = []
        try:
            # Try to find title/reason patterns in the text
            # Pattern 1: Look for "title": "..." and "reason": "..." pairs
            title_pattern = r'"title"\s*:\s*"([^"]*)"'
            reason_pattern = r'"reason"\s*:\s*"([^"]*)"'

            titles = re.findall(title_pattern, response_text)
            reasons = re.findall(reason_pattern, response_text)

            # Match titles with reasons
            for i, title in enumerate(titles):
                reason = reasons[i] if i < len(reasons) else "AI-generated suggestion"
                if title.strip():
                    suggestions.append(
                        SuggestedTask(title=title.strip(), reason=reason.strip())
                    )

            if suggestions:
                logger.info(f"Fallback parser extracted {len(suggestions)} suggestions")

        except Exception as e:
            logger.error(f"Fallback parser failed: {str(e)}")

        return suggestions

    def generate_suggestions(
        self, db: Session, user_id: int, query: str
    ) -> AISuggestionResponse:
        """
        Generate AI task suggestions based on user context and query

        Args:
            db: Database session
            user_id: ID of the user
            query: Natural language query from user

        Returns:
            AISuggestionResponse with suggestions
        """
        # Check if LLM is initialized
        if not self.llm:
            logger.error("LangChain LLM not initialized")
            return AISuggestionResponse(
                success=False,
                suggestions=[],
                message="AI service is not available. Please check API configuration.",
                query_context=None,
            )

        try:
            # Retrieve user context (goals and notes)
            context = UserRepository.get_user_context(db, user_id)

            if not context:
                return AISuggestionResponse(
                    success=False,
                    suggestions=[],
                    message="User not found",
                    query_context=None,
                )

            goals, notes = context

            # If user has no goals/notes, provide guidance
            if not goals and not notes:
                return AISuggestionResponse(
                    success=True,
                    suggestions=[],
                    message="Please set your goals and notes first to get personalized suggestions",
                    query_context="No context available",
                )

            # Construct prompt
            prompt = PromptTemplate(
                template=TASK_SUGGESTION_TEMPLATE,
                input_variables=["goals", "notes", "query"],
            )

            # Create LangChain chain
            chain = prompt | self.llm

            # Generate suggestions
            logger.info(f"Generating suggestions for user {user_id}")
            response = chain.invoke(
                {
                    "goals": goals or "No goals set",
                    "notes": notes or "No notes available",
                    "query": query,
                }
            )

            # Extract text from response
            if hasattr(response, "content"):
                response_text = response.content
            else:
                response_text = str(response)

            logger.debug(f"AI Response (first 200 chars): {response_text[:200]}...")

            # Parse response
            suggestions = self._parse_ai_response(str(response_text))

            # Build context summary for response
            query_context = (
                f"Goals: {goals or 'None set'} | Notes: {notes or 'None set'}"
            )

            # Return response with appropriate message
            if not suggestions:
                return AISuggestionResponse(
                    success=True,
                    suggestions=[],
                    message="Unable to generate suggestions from AI response. Please try rephrasing your query.",
                    query_context=query_context,
                )

            return AISuggestionResponse(
                success=True,
                suggestions=suggestions,
                message=f"Generated {len(suggestions)} task suggestions based on your context",
                query_context=query_context,
            )

        except Exception as e:
            logger.error(f"Error generating suggestions: {str(e)}")
            return AISuggestionResponse(
                success=False,
                suggestions=[],
                message=f"Error generating suggestions: {str(e)}",
                query_context=None,
            )

    def validate_connection(self) -> bool:
        """
        Validate that LangChain connection to Gemini is working

        Returns:
            True if connection is valid, False otherwise
        """
        if not self.llm:
            return False

        try:
            # Send a simple test prompt
            test_prompt = "Say 'OK' in one word."
            _ = self.llm.invoke(test_prompt)
            logger.info("LangChain connection validated")
            return True
        except Exception as e:
            logger.error(f"LangChain connection validation failed: {str(e)}")
            return False


# ============================================================================
# SERVICE INITIALIZATION
# ============================================================================

# Initialize service (singleton pattern)
langchain_service = LangChainService()
