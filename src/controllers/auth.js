import * as authServises from '../services/auth.js';

const setUpSession = (res, session) => {
  res.cookie('refreshToken', session.refreshToken, {
    httpOnly: true,
    expires: session.refreshTokenValidUntil,
  });
  res.cookie('sessionId', session._id, {
    httpOnly: true,
    expires: session.refreshTokenValidUntil,
  });
};

export const registerController = async (req, res) => {
    const newUser = await authServises.register(req.body);

  res.status(201).json({
    status: 201,
    message: 'Successfully registered a user!',
    data: {
      id: newUser._id,
      name: newUser.name,
      email: newUser.email,
      createdAt: newUser.createdAt,
      updatedAt: newUser.updatedAt,
    },
  });
};

export const loginController = async (req, res) => {
  const session = await authServises.login(req.body);

  setUpSession(res, session);

  res.json({
    status: 200,
    message: 'Successfully logged in an user!',
    data: {
      accessToken: session.accessToken,
    },
  });
};

export const refreshSessionController = async (req, res) => {
  const session = await authServises.refreshUserSession(req.cookies);
  setUpSession(res, session);

  res.json({
    status: 200,
    message: 'Successfully refreshed a session!',
    data: {
      accessToken: session.accessToken,
    },
  });
};

export const logoutController = async (req, res) => {
    if (req.cookies.sessionId) {
      await authServises.logout(req.cookies.sessionId);
    }
  res.clearCookie('sessionId');
  res.clearCookie('refreshToken');

  res.status(204).send();
};

export const requestResetEmailController = async (req, res) => {
  await authServises.requestResetToken(req.body.email);

  res.json({
    message: "Reset password email has been successfully sent.",
    status: 200,
    data: {},
  });
};

export const resetPasswordController = async (req, res) => {
  await authServises.resetPassword(req.body);
  res.json({
    status: 200,
    message: "Password has been successfully reset.",
    data: {}
  });
};
