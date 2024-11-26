import express from 'express';
import cors from 'cors';
import authRouter from './routers/auth.js';
import contactsRouter from './routers/contacts.js';
import { notFoundHadler } from './middlewares/notFoundHandler.js';
import { errorHandler } from './middlewares/errorHandler.js';
import { logger } from './middlewares/logger.js';
import cookieParser from 'cookie-parser';

export const setupServer = () => {
  const app = express();

  app.use(cors());

  app.use(express.json());
  app.use(cookieParser());
  app.use(express.static('uploads'));

  app.use(logger);

  app.use('/contacts', contactsRouter);
  app.use('/auth', authRouter);

  app.use(notFoundHadler);

  app.use(errorHandler);

  app.listen(3000, () => console.log('Server is running on port 3000'));
};
