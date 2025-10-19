"""
Repository layer for data access - separates business logic from database queries
"""

import logging
from typing import List, Optional

from sqlalchemy.orm import Session

from src.repository.database import Task, User
from src.schemas import ContextUpdate, TaskCreate, TaskUpdate

logger = logging.getLogger(__name__)


# ============================================================================
# USER REPOSITORY
# ============================================================================


class UserRepository:
    """Repository for User model database operations"""

    @staticmethod
    def get_user_by_id(db: Session, user_id: int) -> Optional[User]:
        """Get user by ID"""
        return db.query(User).filter(User.id == user_id).first()

    @staticmethod
    def get_user_by_email(db: Session, email: str) -> Optional[User]:
        """Get user by email"""
        return db.query(User).filter(User.email == email).first()

    @staticmethod
    def get_all_users(db: Session) -> List[User]:
        """Get all users (admin only - for development)"""
        return db.query(User).all()

    @staticmethod
    def update_user_context(
        db: Session, user_id: int, context_data: ContextUpdate
    ) -> Optional[User]:
        """Update user's goals and notes"""
        try:
            user = UserRepository.get_user_by_id(db, user_id)
            if not user:
                logger.warning(f"User {user_id} not found for context update")
                return None

            if context_data.goals is not None:
                user.goals = context_data.goals
            if context_data.notes is not None:
                user.notes = context_data.notes

            db.commit()
            db.refresh(user)
            logger.info(f"User {user_id} context updated successfully")
            return user

        except Exception as e:
            db.rollback()
            logger.error(f"Error updating user context: {str(e)}")
            return None

    @staticmethod
    def get_user_context(db: Session, user_id: int) -> Optional[tuple[str, str]]:
        """
        Get user's goals and notes for AI context

        Returns:
            Tuple of (goals, notes) or None if user not found
        """
        user = UserRepository.get_user_by_id(db, user_id)
        if not user:
            return None
        return (user.goals or "", user.notes or "")


# ============================================================================
# TASK REPOSITORY
# ============================================================================


class TaskRepository:
    """Repository for Task model database operations"""

    @staticmethod
    def create_task(db: Session, user_id: int, task_data: TaskCreate) -> Optional[Task]:
        """Create a new task"""
        try:
            new_task = Task(user_id=user_id, title=task_data.title, is_completed=False)
            db.add(new_task)
            db.commit()
            db.refresh(new_task)
            logger.info(f"Task created: {new_task.id} for user {user_id}")
            return new_task

        except Exception as e:
            db.rollback()
            logger.error(f"Error creating task: {str(e)}")
            return None

    @staticmethod
    def get_task_by_id(db: Session, task_id: int) -> Optional[Task]:
        """Get task by ID"""
        return db.query(Task).filter(Task.id == task_id).first()

    @staticmethod
    def get_tasks_by_user(db: Session, user_id: int) -> List[Task]:
        """Get all tasks for a user"""
        return (
            db.query(Task)
            .filter(Task.user_id == user_id)
            .order_by(Task.created_at.desc())
            .all()
        )

    @staticmethod
    def get_pending_tasks(db: Session, user_id: int) -> List[Task]:
        """Get incomplete tasks for a user"""
        return (
            db.query(Task)
            .filter(Task.user_id == user_id, Task.is_completed.is_(False))
            .order_by(Task.created_at.desc())
            .all()
        )

    @staticmethod
    def get_completed_tasks(db: Session, user_id: int) -> List[Task]:
        """Get completed tasks for a user"""
        return (
            db.query(Task)
            .filter(Task.user_id == user_id, Task.is_completed.is_(True))
            .order_by(Task.created_at.desc())
            .all()
        )

    @staticmethod
    def get_task_statistics(db: Session, user_id: int) -> dict:
        """Get task statistics for a user"""
        total = db.query(Task).filter(Task.user_id == user_id).count()
        completed = (
            db.query(Task)
            .filter(Task.user_id == user_id, Task.is_completed.is_(True))
            .count()
        )
        pending = total - completed

        return {
            "total": total,
            "completed": completed,
            "pending": pending,
            "completion_rate": (completed / total * 100) if total > 0 else 0,
        }

    @staticmethod
    def update_task(db: Session, task_id: int, task_data: TaskUpdate) -> Optional[Task]:
        """Update a task"""
        try:
            task = TaskRepository.get_task_by_id(db, task_id)
            if not task:
                logger.warning(f"Task {task_id} not found for update")
                return None

            if task_data.title is not None:
                task.title = task_data.title
            if task_data.is_completed is not None:
                task.is_completed = task_data.is_completed

            db.commit()
            db.refresh(task)
            logger.info(f"Task {task_id} updated successfully")
            return task

        except Exception as e:
            db.rollback()
            logger.error(f"Error updating task: {str(e)}")
            return None

    @staticmethod
    def delete_task(db: Session, task_id: int) -> bool:
        """Delete a task"""
        try:
            task = TaskRepository.get_task_by_id(db, task_id)
            if not task:
                logger.warning(f"Task {task_id} not found for deletion")
                return False

            db.delete(task)
            db.commit()
            logger.info(f"Task {task_id} deleted successfully")
            return True

        except Exception as e:
            db.rollback()
            logger.error(f"Error deleting task: {str(e)}")
            return False

    @staticmethod
    def bulk_create_tasks(
        db: Session, user_id: int, task_titles: List[str]
    ) -> List[Task]:
        """Create multiple tasks at once"""
        try:
            tasks = []
            for title in task_titles:
                new_task = Task(user_id=user_id, title=title, is_completed=False)
                tasks.append(new_task)

            db.add_all(tasks)
            db.commit()
            logger.info(f"Bulk created {len(tasks)} tasks for user {user_id}")
            return tasks

        except Exception as e:
            db.rollback()
            logger.error(f"Error bulk creating tasks: {str(e)}")
            return []
