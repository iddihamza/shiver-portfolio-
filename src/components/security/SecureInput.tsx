import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useSecureInput, validationPatterns } from '@/hooks/useSecureInput';

interface SecureInputProps {
  label: string;
  id: string;
  type?: 'text' | 'email' | 'password' | 'search';
  placeholder?: string;
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: 'email' | 'filename' | 'alphanumeric' | 'noSpecialChars';
  customValidation?: (value: string) => string | null;
  disabled?: boolean;
  autoComplete?: string;
  onSecureChange?: (value: string, isValid: boolean) => void;
}

export const SecureInput: React.FC<SecureInputProps> = ({
  label,
  id,
  type = 'text',
  placeholder,
  required = false,
  minLength,
  maxLength = 200,
  pattern,
  customValidation,
  disabled = false,
  autoComplete,
  onSecureChange
}) => {
  const validation = {
    required,
    minLength,
    maxLength,
    pattern: pattern ? validationPatterns[pattern] : undefined,
    custom: customValidation
  };

  const {
    value,
    error,
    touched,
    isValid,
    handleChange,
    handleBlur
  } = useSecureInput('', {
    validation,
    sanitize: true
  });

  React.useEffect(() => {
    if (onSecureChange) {
      onSecureChange(value, isValid);
    }
  }, [value, isValid, onSecureChange]);

  return (
    <div className="space-y-2">
      <Label htmlFor={id}>
        {label}
        {required && <span className="text-destructive ml-1">*</span>}
      </Label>
      <Input
        id={id}
        type={type}
        value={value}
        onChange={(e) => handleChange(e.target.value)}
        onBlur={handleBlur}
        placeholder={placeholder}
        disabled={disabled}
        autoComplete={autoComplete}
        maxLength={maxLength}
        aria-invalid={touched && error ? 'true' : 'false'}
        aria-describedby={error ? `${id}-error` : undefined}
      />
      {touched && error && (
        <Alert variant="destructive" className="py-2">
          <AlertDescription id={`${id}-error`} className="text-sm">
            {error}
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
};