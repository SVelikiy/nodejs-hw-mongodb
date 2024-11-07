import createHttpError from 'http-errors';

export const notFoundHadler = (req, res) => {
  throw createHttpError(404, 'Route not found');
};
