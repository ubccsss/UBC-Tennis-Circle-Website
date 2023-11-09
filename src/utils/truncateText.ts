/**
 * TruncateText function shortens a given text to a specified character limit while adding ellipsis ("...") to indicate truncation.
 * @param {String} text - The input text to be truncated.
 * @param {number} charLimit - The maximum number of characters allowed in the truncated text.
 * @returns {String} - The truncated text with ellipsis.
 */
function truncateText(text: String, charLimit: number): String {
    return text.substring(0, charLimit - 3) + "...";
}