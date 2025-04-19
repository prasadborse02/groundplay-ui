// Phone number validation regex (international format)
export const PHONE_REGEX = /^\+?[0-9]{7,15}$/;

// Email validation regex
export const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

// Password minimum length
export const PASSWORD_MIN_LENGTH = 8;

// Validation functions
export const validatePhoneNumber = (phoneNumber) => {
  return PHONE_REGEX.test(phoneNumber);
};

export const validateEmail = (email) => {
  if (!email) return true; // Email is optional
  return EMAIL_REGEX.test(email);
};

export const validatePassword = (password) => {
  return password && password.length >= PASSWORD_MIN_LENGTH;
};

export const validateName = (name) => {
  return name && name.trim().length > 0;
};

// Form validation schemas for react-hook-form
export const registerValidationSchema = {
  name: {
    required: 'Name is required',
    validate: (value) => validateName(value) || 'Please enter a valid name',
  },
  phoneNumber: {
    required: 'Phone number is required',
    validate: (value) => validatePhoneNumber(value) || 'Please enter a valid phone number (7-15 digits)',
  },
  email: {
    validate: (value) => validateEmail(value) || 'Please enter a valid email address',
  },
  password: {
    required: 'Password is required',
    minLength: {
      value: PASSWORD_MIN_LENGTH,
      message: `Password must be at least ${PASSWORD_MIN_LENGTH} characters`,
    },
  },
};

export const loginValidationSchema = {
  phoneNumber: {
    required: 'Phone number is required',
    validate: (value) => validatePhoneNumber(value) || 'Please enter a valid phone number (7-15 digits)',
  },
  password: {
    required: 'Password is required',
  },
};

export const createGameValidationSchema = {
  sport: {
    required: 'Sport is required',
  },
  startTime: {
    required: 'Start time is required',
  },
  endTime: {
    required: 'End time is required',
  },
  teamSize: {
    required: 'Team size is required',
    min: {
      value: 2,
      message: 'Team size must be at least 2',
    },
    max: {
      value: 100,
      message: 'Team size cannot exceed 100',
    },
  },
  coordinates: {
    validate: (value) => {
      if (!value || !value.lat || !value.lon) {
        return 'Please select a location on the map';
      }
      return true;
    },
  },
};