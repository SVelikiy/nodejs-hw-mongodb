import express from 'express';
import cors from 'cors';
import contactsRouter from './routers/contacts.js';
import { notFoundHadler } from './middlewares/notFoundHandler.js';
import { errorHandler } from './middlewares/errorHandler.js';
import { logger } from './middlewares/logger.js';

export const setupServer = () => {
  const app = express();

  app.use(cors());

  app.use(express.json());

  app.use(logger);

  app.use('/contacts', contactsRouter);

  app.use(notFoundHadler);

  app.use(errorHandler);

  app.listen(3000, () => console.log('Server is running on port 3000'));
};
