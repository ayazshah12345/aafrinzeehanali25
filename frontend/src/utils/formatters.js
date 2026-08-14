/**
 * Utility function to format monetary amounts into Indian Rupees (₹)
 * @param {number|string} amount 
 * @returns {string} Formatted currency string (e.g. ₹1,499.00)
 */
export const formatCurrency = (amount) => {
  const numericAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
  if (isNaN(numericAmount)) return '₹0.00';
  
  return `₹${numericAmount.toLocaleString('en-IN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
};
