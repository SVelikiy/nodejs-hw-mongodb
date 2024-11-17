import Joi from 'joi';
import { emailRegexp } from '../constants/user.js';

export const authRegisterSchema = Joi.object({
  name: Joi.string().required().min(3).max(20),
  email: Joi.string().required().pattern(emailRegexp),
  password: Joi.string().required().min(3).max(20),
});

export const authLoginSchema = Joi.object({
  email: Joi.string().required().pattern(emailRegexp),
  password: Joi.string().required().min(3).max(20),
});
