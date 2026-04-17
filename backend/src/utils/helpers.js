/**
 * Create a standardized success response object.
 */
export const successResponse = (data, message = 'Success') => ({
  success: true,
  message,
  data,
});

/**
 * Create a standardized error response object.
 */
export const errorResponse = (message = 'An error occurred', errors = null) => ({
  success: false,
  error: message,
  ...(errors && { errors }),
});

/**
 * Sanitize user input by trimming and removing potential XSS characters.
 */
export const sanitizeInput = (str) => {
  if (typeof str !== 'string') return str;
  return str
    .trim()
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;');
};

/**
 * Build a pagination object for consistent API responses.
 */
export const buildPagination = (page, limit, total) => ({
  page,
  limit,
  total,
  totalPages: Math.ceil(total / limit),
  hasNextPage: page * limit < total,
  hasPrevPage: page > 1,
});
