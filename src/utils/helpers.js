import { format, parseISO } from 'date-fns';

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
];

// Get sport label from value
export const getSportLabel = (value) => {
  const sport = SPORT_OPTIONS.find(option => option.value === value);
  return sport ? sport.label : value;
};