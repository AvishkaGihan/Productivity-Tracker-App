"""
LangChain service for AI-powered task suggestions using Google Gemini API
Handles context retrieval, prompt construction, and AI response parsing
"""

import json
import logging
import os
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

Return your response as a JSON array with the following structure:
[
  {{
    "title": "Task title",
    "reason": "Why this task aligns with their goals"
  }},
  ...
]

Only return valid JSON, no additional text.
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

            # Parse JSON
            suggestions_data = json.loads(response_text)

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
            return []
        except Exception as e:
            logger.error(f"Error parsing AI response: {str(e)}")
            return []

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

            logger.debug(f"AI Response: {response_text}")

            # Parse response
            suggestions = self._parse_ai_response(str(response_text))

            # Build context summary for response
            query_context = (
                f"Goals: {goals or 'None set'} | Notes: {notes or 'None set'}"
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
