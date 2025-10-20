export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const isStrongPassword = (password: string): boolean => {
  return (
    password.length >= 8 &&
    /[A-Z]/.test(password) &&
    /[a-z]/.test(password) &&
    /[0-9]/.test(password)
  );
};

export const validateTaskTitle = (
  title: string
): { valid: boolean; error?: string } => {
  if (!title.trim()) {
    return { valid: false, error: "Task title cannot be empty" };
  }
  if (title.length > 255) {
    return { valid: false, error: "Task title cannot exceed 255 characters" };
  }
  return { valid: true };
};
