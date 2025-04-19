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
    
    // Format for input
    return formatDateForInput(endDate.toISOString());
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