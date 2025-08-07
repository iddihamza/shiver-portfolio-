import { useState, useCallback } from 'react';

interface ValidationRule {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  custom?: (value: string) => string | null;
}

interface UseSecureInputOptions {
  validation?: ValidationRule;
  sanitize?: boolean;
}

export const useSecureInput = (initialValue = '', options: UseSecureInputOptions = {}) => {
  const [value, setValue] = useState(initialValue);
  const [error, setError] = useState<string | null>(null);
  const [touched, setTouched] = useState(false);

  const sanitizeInput = useCallback((input: string): string => {
    if (!options.sanitize) return input;
    
    // Remove potentially dangerous characters
    return input
      .replace(/[<>]/g, '') // Remove < and > to prevent XSS
      .replace(/javascript:/gi, '') // Remove javascript: protocol
      .replace(/on\w+=/gi, '') // Remove event handlers
      .trim();
  }, [options.sanitize]);

  const validateInput = useCallback((input: string): string | null => {
    const validation = options.validation;
    if (!validation) return null;

    if (validation.required && !input.trim()) {
      return 'This field is required';
    }

    if (validation.minLength && input.length < validation.minLength) {
      return `Must be at least ${validation.minLength} characters`;
    }

    if (validation.maxLength && input.length > validation.maxLength) {
      return `Must be no more than ${validation.maxLength} characters`;
    }

    if (validation.pattern && !validation.pattern.test(input)) {
      return 'Invalid format';
    }

    if (validation.custom) {
      return validation.custom(input);
    }

    return null;
  }, [options.validation]);

  const handleChange = useCallback((newValue: string) => {
    const sanitized = sanitizeInput(newValue);
    setValue(sanitized);
    
    if (touched) {
      const validationError = validateInput(sanitized);
      setError(validationError);
    }
  }, [sanitizeInput, validateInput, touched]);

  const handleBlur = useCallback(() => {
    setTouched(true);
    const validationError = validateInput(value);
    setError(validationError);
  }, [value, validateInput]);

  const reset = useCallback(() => {
    setValue(initialValue);
    setError(null);
    setTouched(false);
  }, [initialValue]);

  const isValid = error === null && (options.validation?.required ? value.trim() !== '' : true);

  return {
    value,
    error,
    touched,
    isValid,
    handleChange,
    handleBlur,
    reset,
    setValue: handleChange
  };
};

// Common validation patterns
export const validationPatterns = {
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  filename: /^[a-zA-Z0-9._-]+$/,
  alphanumeric: /^[a-zA-Z0-9]+$/,
  noSpecialChars: /^[a-zA-Z0-9\s]+$/
};