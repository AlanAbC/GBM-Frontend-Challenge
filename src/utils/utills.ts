import { format } from "date-fns";

/**
 * Adds commas to a number string for better readability
 * @param x - Input number as a string
 * @returns Number string with commas
 */
const numberWithCommas = (x: string) => {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

/**
 * Formats a price with commas and a dollar sign
 * @param price - Input price as a number
 * @returns Formatted price string
 */
const formatPrice = (price?: number) => {
  return `$${numberWithCommas(price?.toFixed(2) ?? "")}`;
};

/**
 * Formats a date string into a human-readable format
 * @param date - Input date as a string
 * @returns Formatted date string (e.g., "January-01-2023")
 */
const formatDate = (date: string) => {
  return format(date ? new Date(date) : new Date(), "MMMM-dd-yyyy");
};

export { formatPrice, numberWithCommas, formatDate };
