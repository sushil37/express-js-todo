export const convertToISO8601 = (dateString) => {
  const date = new Date(dateString);
  if (isNaN(date.getTime())) {
    return null; // Invalid date string
  }
  return date.toISOString();
};
