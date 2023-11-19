// TruncateText function shortens a given text to a specified character limit
// while adding ellipsis ("...") to indicate truncation.
export const truncateText = (text: String, charLimit: number): String => {
  return text.substring(0, charLimit - 3) + "...";
};

