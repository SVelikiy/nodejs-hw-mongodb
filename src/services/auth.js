import UserCollection from '../db/Users.js';
import SessionCollection from '../db/Session.js';
import createHttpError from 'http-errors';
import bcrypt from 'bcrypt';
import { randomBytes } from 'crypto';
import { sendEmail } from '../utils/sendMail.js';
import jwt from 'jsonwebtoken';
import {
  accessTokenLifeTime,
  refreshTokenLifeTime,
} from '../constants/user.js';
import handlebars from 'handlebars';
import path from 'node:path';
import fs from 'node:fs/promises';
import { TEMPLATES_DIR } from '../constants/index.js';
import { env } from '../utils/env.js';

const smtp_from = env("SMTP_FROM");
const jwt_secret = env("JWT_SECRET");
const app_domain = env("APP_DOMAIN");


const createSession = () => {
  const accessToken = randomBytes(30).toString('base64');
  const refreshToken = randomBytes(30).toString('base64');
  return {
    accessToken,
    refreshToken,
    accessTokenValidUntil: Date.now() + accessTokenLifeTime,
    refreshTokenValidUntil: Date.now() + refreshTokenLifeTime,
  };
};

export const register = async (payload) => {
  const { email, password } = payload;
  const user = await UserCollection.findOne({ email });
  if (user) {
    throw createHttpError(409, 'Email in use');
  }

  const hashPassword = await bcrypt.hash(password, 10);

  return UserCollection.create({ ...payload, password: hashPassword });
};

export const login = async ({ email, password }) => {
  const user = await UserCollection.findOne({ email });
  if (!user) {
    throw createHttpError(401, 'Email or password invalid');
  }
  const comparePassword = await bcrypt.compare(password, user.password);

  if (!comparePassword) {
    throw createHttpError(401, 'Email or password invalid');
  }
  await SessionCollection.deleteOne({ userId: user._id });

  const newSession = createSession();

  return SessionCollection.create({
    userId: user._id,
    ...newSession,
  });
};

export const refreshUserSession = async ({ refreshToken }) => {
  const session = await SessionCollection.findOne({ refreshToken });
  if (!session) {
    throw createHttpError(401, 'Session not found');
  }
  if (Date.now() > session.refreshTokenValidUntil) {
    throw createHttpError(401, 'Session token expired');
  }
  await SessionCollection.deleteOne({ userId: session.userId });

  const newSession = createSession();

  return SessionCollection.create({
    userId: session.userId,
    ...newSession,
  });
};

export const logout = async (sessionId) => {
    await SessionCollection.deleteOne({ _id: sessionId });
};

export const findSession = async (filter) => SessionCollection.findOne(filter);

export const findUser = async (filter) => UserCollection.findOne(filter);

export const requestResetToken = async (email) => {
  const user = await UserCollection.findOne({email});
  if (!user) {
    createHttpError(404, 'User not found!');
  }
const resetToken = jwt.sign(
  {
    sub: user._id,
    email,
  },
  jwt_secret,
  {
    expiresIn: '15m',
  },
);
  const resetPasswordTemplatePath = path.join(
    TEMPLATES_DIR,
    'reset-password-email.html',
  );

  const templateSource = (await fs.readFile(resetPasswordTemplatePath)).toString();

  const template = handlebars.compile(templateSource);

  const html = template({
    name: user.name,
    link: `https://${app_domain}/reset-password?token=${resetToken}`,
  });


    await sendEmail({
    from: smtp_from,
    to: email,
    subject: 'Reset your password',
    html,
  });
};

export const resetPassword = async (payload) => {
  let entries;

  try {
    entries = jwt.verify(payload.token, jwt_secret);
  } catch (error) {
    if (error instanceof Error) throw createHttpError(401, 'Token is expired or invalid.');
    throw error;
  }
  const user = await UserCollection.findOne({
    email: entries.email,
    _id: entries.sub,
  });

  if (!user) throw createHttpError(404, 'User not found');

  const encryptedPassword = await bcrypt.hash(payload.password, 10);

  await UserCollection.updateOne({
    _id: user._id
  },
    { password: encryptedPassword },);
};
