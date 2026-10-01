/**
 * utils/asyncHandler.js
 *
 * A higher-order function that wraps an async Express route handler and
 * forwards any rejected promise to the next() error handler automatically.
 * This removes the need for repetitive try/catch blocks in every controller.
 *
 * Usage:
 *   router.get('/', asyncHandler(ctrl.list));
 */

'use strict';

/**
 * @param {Function} fn - An async Express handler (req, res, next) => Promise.
 * @returns {Function}  - A regular Express handler that catches rejections.
 */
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

module.exports = asyncHandler;
