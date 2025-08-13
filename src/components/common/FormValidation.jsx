// Form validation utilities and components
import React, { useState } from 'react';
import { AlertCircle, CheckCircle } from 'lucide-react';

// Validation rules
export const validationRules = {
  required: (value) => {
    if (!value || (typeof value === 'string' && value.trim() === '')) {
      return 'This field is required';
    }
    return null;
  },
  
  email: (value) => {
    if (!value) return null;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(value) ? null : 'Please enter a valid email address';
  },
  
  phone: (value) => {
    if (!value) return null;
    // Matches (XXX)-XXX-XXXX format
    const phoneRegex = /^\(\d{3}\)-\d{3}-\d{4}$/;
    return phoneRegex.test(value) ? null : 'Please enter a valid phone number';
  },
  
  minLength: (min) => (value) => {
    if (!value) return null;
    return value.length >= min ? null : `Must be at least ${min} characters long`;
  },
  
  maxLength: (max) => (value) => {
    if (!value) return null;
    return value.length <= max ? null : `Must be no more than ${max} characters long`;
  },
  
  number: (value) => {
    if (!value) return null;
    return !isNaN(Number(value)) ? null : 'Please enter a valid number';
  },
  
  positiveNumber: (value) => {
    if (!value) return null;
    const num = Number(value);
    return !isNaN(num) && num > 0 ? null : 'Please enter a positive number';
  },
  
  otp: (value) => {
    if (!value) return null;
    return /^\d{6}$/.test(value) ? null : 'Please enter a 6-digit code';
  }
};

// Custom hook for form validation
export const useFormValidation = (initialValues = {}, validationSchema = {}) => {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const validateField = (name, value) => {
    const fieldRules = validationSchema[name];
    if (!fieldRules) return null;

    for (const rule of fieldRules) {
      const error = rule(value);
      if (error) return error;
    }
    return null;
  };

  const validateForm = () => {
    const newErrors = {};
    let isValid = true;

    Object.keys(validationSchema).forEach(fieldName => {
      const error = validateField(fieldName, values[fieldName]);
      if (error) {
        newErrors[fieldName] = error;
        isValid = false;
      }
    });

    setErrors(newErrors);
    return isValid;
  };

  const handleChange = (name, value) => {
    setValues(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const handleBlur = (name) => {
    setTouched(prev => ({ ...prev, [name]: true }));
    
    const error = validateField(name, values[name]);
    setErrors(prev => ({ ...prev, [name]: error }));
  };

  const reset = (newValues = initialValues) => {
    setValues(newValues);
    setErrors({});
    setTouched({});
  };

  return {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    validateForm,
    reset,
    isValid: Object.keys(errors).length === 0
  };
};

// Validated Input Component
export const ValidatedInput = ({ 
  name,
  label,
  type = 'text',
  placeholder,
  value,
  error,
  touched,
  onChange,
  onBlur,
  required = false,
  className = '',
  ...props
}) => {
  const hasError = touched && error;
  const isValid = touched && !error && value;

  return (
    <div className="space-y-2">
      {label && (
        <label htmlFor={name} className="block text-sm font-medium text-gray-700">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      <div className="relative">
        <input
          id={name}
          name={name}
          type={type}
          placeholder={placeholder}
          value={value || ''}
          onChange={(e) => onChange(name, e.target.value)}
          onBlur={() => onBlur(name)}
          className={`
            w-full px-3 py-2 border rounded-md transition-colors
            ${hasError 
              ? 'border-red-300 focus:border-red-500 focus:ring-red-200' 
              : isValid
                ? 'border-green-300 focus:border-green-500 focus:ring-green-200'
                : 'border-gray-300 focus:border-blue-500 focus:ring-blue-200'
            }
            focus:outline-none focus:ring-2 focus:ring-opacity-50
            ${className}
          `}
          {...props}
        />
        
        {/* Status icon */}
        <div className="absolute inset-y-0 right-0 flex items-center pr-3">
          {hasError && <AlertCircle className="w-5 h-5 text-red-500" />}
          {isValid && <CheckCircle className="w-5 h-5 text-green-500" />}
        </div>
      </div>
      
      {/* Error message */}
      {hasError && (
        <p className="text-sm text-red-600 flex items-center gap-1">
          <AlertCircle className="w-4 h-4" />
          {error}
        </p>
      )}
    </div>
  );
};

export default { useFormValidation, ValidatedInput, validationRules };