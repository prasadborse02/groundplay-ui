import { format, parseISO, addHours, addMinutes } from 'date-fns';

// Format date and time
export const formatDateTime = (dateString) => {
  try {
    const date = parseISO(dateString);
    return format(date, 'MMM d, yyyy h:mm a');
  } catch (error) {
    console.error('Date formatting error:', error);
    return dateString;
  }
};

// Format date only
export const formatDate = (dateString) => {
  try {
    const date = parseISO(dateString);
    return format(date, 'MMM d, yyyy');
  } catch (error) {
    console.error('Date formatting error:', error);
    return dateString;
  }
};

// Format time only
export const formatTime = (dateString) => {
  try {
    const date = parseISO(dateString);
    return format(date, 'h:mm a');
  } catch (error) {
    console.error('Time formatting error:', error);
    return dateString;
  }
};

// Format date for input field (yyyy-MM-ddTHH:mm)
export const formatDateForInput = (dateString) => {
  try {
    const date = parseISO(dateString);
    return format(date, "yyyy-MM-dd'T'HH:mm");
  } catch (error) {
    console.error('Date formatting error:', error);
    return '';
  }
};

// Calculate end time based on start time and duration
export const calculateEndTime = (startTime, durationHours, durationMinutes) => {
  try {
    // Ensure we have valid start time
    if (!startTime) return '';
    
    // Convert empty values to 0
    const hours = durationHours === '' || isNaN(durationHours) ? 0 : parseInt(durationHours);
    const minutes = durationMinutes === '' || isNaN(durationMinutes) ? 0 : parseInt(durationMinutes);
    
    // Ensure hours doesn't exceed 24
    const safeHours = Math.min(hours, 24);
    // If hours is 24, minutes must be 0
    const safeMinutes = safeHours === 24 ? 0 : minutes;
    
    // If both duration values are 0, return empty string
    if (safeHours === 0 && safeMinutes === 0) return '';
    
    // Parse start date
    const startDate = new Date(startTime);
    
    // Check for invalid date
    if (isNaN(startDate.getTime())) {
      return '';
    }
    
    // Add duration (create a new date to avoid mutation)
    let endDate = new Date(startDate);
    if (safeHours > 0) endDate = addHours(endDate, safeHours);
    if (safeMinutes > 0) endDate = addMinutes(endDate, safeMinutes);
    
    // Format directly for input without conversion
    const year = endDate.getFullYear();
    const month = String(endDate.getMonth() + 1).padStart(2, '0');
    const day = String(endDate.getDate()).padStart(2, '0');
    const hourStr = String(endDate.getHours()).padStart(2, '0');
    const minuteStr = String(endDate.getMinutes()).padStart(2, '0');
    
    return `${year}-${month}-${day}T${hourStr}:${minuteStr}`;
  } catch (error) {
    return '';
  }
};

// Generate game URL for sharing
export const getShareableGameUrl = (gameId) => {
  return `${window.location.origin}/game/${gameId}`;
};

// Copy text to clipboard
export const copyToClipboard = async (text) => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (error) {
    console.error('Failed to copy text:', error);
    return false;
  }
};

// Extract error message from API response
export const getErrorMessage = (error) => {
  // If response contains both code and message, we'll format based on the code
  if (error.response?.data?.code) {
    const errorCode = error.response.data.code;
    const message = error.response.data.message || '';
    
    // Format specific error messages based on error codes
    switch (errorCode) {
      case 'PLAYER_NOT_AVAILABLE':
        return 'You already have a game scheduled during this time. Please check your calendar.';
        
      case 'GAME_FULL':
        return 'This game is already full. No more players can enroll.';
        
      case 'GAME_CONFLICT':
        return 'Unable to join this game due to a scheduling conflict.';
        
      case 'INVALID_CREDENTIALS':
        return 'The phone number or password you entered is incorrect.';
        
      case 'AUTHENTICATION_ERROR':
        return 'Authentication failed. Please sign in again.';
        
      case 'ACCESS_DENIED':
      case 'UNAUTHORIZED_OPERATION':
        return 'You don\'t have permission to perform this action.';
        
      case 'RESOURCE_NOT_FOUND':
        return 'The requested resource could not be found.';
        
      case 'RESOURCE_ALREADY_EXISTS':
        return 'This resource already exists.';
        
      case 'VALIDATION_ERROR':
        return message || 'Please check your inputs and try again.';
        
      default:
        // Return the server message if available, otherwise generic message based on status code
        if (message) {
          return message;
        } else if (error.response?.status) {
          // Format message based on status code
          switch (error.response.status) {
            case 400: return 'Invalid request. Please check your inputs.';
            case 401: return 'Please log in to continue.';
            case 403: return 'You don\'t have permission to perform this action.';
            case 404: return 'The requested resource could not be found.';
            case 409: return 'There was a conflict with your request.';
            case 500: return 'A server error occurred. Please try again later.';
            default: return 'Something went wrong. Please try again.';
          }
        }
    }
  }
  
  // Fallback to basic error handling if response format doesn't match
  return error.response?.data?.message || 
         error.message || 
         'Something went wrong. Please try again.';
};

// Sport options for dropdown
export const SPORT_OPTIONS = [
  { value: 'CRICKET', label: 'Cricket' },
  { value: 'FOOTBALL', label: 'Football' },
  { value: 'VOLLEYBALL', label: 'Volleyball' },
  { value: 'TENNIS', label: 'Tennis' },
  { value: 'BADMINTON', label: 'Badminton' },
  { value: 'HOCKEY', label: 'Hockey' },
  { value: 'KABADDI', label: 'Kabaddi' },
  { value: 'KHO_KHO', label: 'Kho Kho' },
  { value: 'BASKETBALL', label: 'Basketball' },
];

// Get sport label from value
export const getSportLabel = (value) => {
  const sport = SPORT_OPTIONS.find(option => option.value === value);
  return sport ? sport.label : value;
};

// Function to get all country codes from country-codes-list
// Cached to avoid recomputing on every render
let countriesCache = null;

export const getCountryCodes = () => {
  if (countriesCache) return countriesCache;
  
  try {
    // Import the country codes list package
    const countryCodesList = require('country-codes-list');
    
    // Get all countries with their calling codes
    const allCountries = countryCodesList.all();
    
    // Create the array in the format we need
    const countries = allCountries.map(country => {
      return {
        code: `+${country.countryCallingCode}`,
        countryCode: country.countryCode,
        flag: getCountryFlag(country.countryCode),
        sortValue: country.countryNameEn === 'India' ? 0 : 1 // India gets priority
      };
    });
    
    // Filter out any duplicates or empty values
    const uniqueCodes = new Set();
    const filtered = countries.filter(country => {
      if (!country.code || country.code === '+' || uniqueCodes.has(country.code)) return false;
      uniqueCodes.add(country.code);
      return true;
    });
    
    // Sort: India first, then by dialing code
    const sorted = filtered.sort((a, b) => {
      if (a.sortValue !== b.sortValue) return a.sortValue - b.sortValue;
      return a.code.localeCompare(b.code);
    });
    
    countriesCache = sorted;
    return sorted;
  } catch (err) {
    console.error('Error loading country codes:', err);
    
    // Fallback if the package fails to load
    const fallbackCodes = [
      { code: '+91', flag: '🇮🇳' }, // India
      { code: '+1', flag: '🇺🇸' },  // USA
      { code: '+7', flag: '🇷🇺' },  // Russia
      { code: '+20', flag: '🇪🇬' }, // Egypt
      { code: '+27', flag: '🇿🇦' }, // South Africa
      { code: '+30', flag: '🇬🇷' }, // Greece
      { code: '+31', flag: '🇳🇱' }, // Netherlands
      { code: '+32', flag: '🇧🇪' }, // Belgium
      { code: '+33', flag: '🇫🇷' }, // France
      { code: '+34', flag: '🇪🇸' }, // Spain
      { code: '+36', flag: '🇭🇺' }, // Hungary
      { code: '+39', flag: '🇮🇹' }, // Italy
      { code: '+40', flag: '🇷🇴' }, // Romania
      { code: '+41', flag: '🇨🇭' }, // Switzerland
      { code: '+43', flag: '🇦🇹' }, // Austria
      { code: '+44', flag: '🇬🇧' }, // UK
      { code: '+45', flag: '🇩🇰' }, // Denmark
      { code: '+46', flag: '🇸🇪' }, // Sweden
      { code: '+47', flag: '🇳🇴' }, // Norway
      { code: '+48', flag: '🇵🇱' }, // Poland
      { code: '+49', flag: '🇩🇪' }, // Germany
      { code: '+51', flag: '🇵🇪' }, // Peru
      { code: '+52', flag: '🇲🇽' }, // Mexico
      { code: '+55', flag: '🇧🇷' }, // Brazil
      { code: '+56', flag: '🇨🇱' }, // Chile
      { code: '+57', flag: '🇨🇴' }, // Colombia
      { code: '+60', flag: '🇲🇾' }, // Malaysia
      { code: '+61', flag: '🇦🇺' }, // Australia
      { code: '+62', flag: '🇮🇩' }, // Indonesia
      { code: '+63', flag: '🇵🇭' }, // Philippines
      { code: '+64', flag: '🇳🇿' }, // New Zealand
      { code: '+65', flag: '🇸🇬' }, // Singapore
      { code: '+66', flag: '🇹🇭' }, // Thailand
      { code: '+81', flag: '🇯🇵' }, // Japan
      { code: '+82', flag: '🇰🇷' }, // South Korea
      { code: '+84', flag: '🇻🇳' }, // Vietnam
      { code: '+86', flag: '🇨🇳' }, // China
      { code: '+90', flag: '🇹🇷' }, // Turkey
      { code: '+92', flag: '🇵🇰' }, // Pakistan
      { code: '+94', flag: '🇱🇰' }, // Sri Lanka
      { code: '+95', flag: '🇲🇲' }, // Myanmar
      { code: '+98', flag: '🇮🇷' }, // Iran
      { code: '+212', flag: '🇲🇦' }, // Morocco
      { code: '+213', flag: '🇩🇿' }, // Algeria
      { code: '+216', flag: '🇹🇳' }, // Tunisia
      { code: '+218', flag: '🇱🇾' }, // Libya
      { code: '+220', flag: '🇬🇲' }, // Gambia
      { code: '+221', flag: '🇸🇳' }, // Senegal
      { code: '+223', flag: '🇲🇱' }, // Mali
      { code: '+224', flag: '🇬🇳' }, // Guinea
      { code: '+225', flag: '🇨🇮' }, // Ivory Coast
    ];
    
    return fallbackCodes;
  }
};

// Convert country code to flag emoji (e.g., "US" -> "🇺🇸")
const getCountryFlag = (countryCode) => {
  if (!countryCode) return '';
  
  try {
    const codePoints = countryCode
      .toUpperCase()
      .split('')
      .map(char => 127397 + char.charCodeAt(0));
    
    return String.fromCodePoint(...codePoints);
  } catch (err) {
    return '';
  }
};

