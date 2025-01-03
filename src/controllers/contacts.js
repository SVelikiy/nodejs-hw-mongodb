import * as contactServices from '../services/contacts.js';
import createHttpError from 'http-errors';
import * as path from 'node:path';
import { parsePaginationParams } from '../utils/parsePaginationsParams.js';
import { parseSortParams } from '../utils/parseSortParams.js';
import { sortByList } from '../db/Contacts.js';
import { parseContactFilterParams } from '../utils/parseContactFilterParams.js';
import { saveFileToUploadDir } from '../utils/saveFileToUploadDir.js';
import { saveFileToCloudinary } from '../utils/saveFileToCloudinary.js';

import { env } from '../utils/env.js';
const enableCloudinary = env('ENABLE_CLOUDINARY');

export const getContactsController = async (req, res) => {
  const { page, perPage } = parsePaginationParams(req.query);
  const { sortBy, sortOrder } = parseSortParams(req.query, sortByList);
  const filter = parseContactFilterParams(req.query);
  const { _id: userId } = req.user;

  const data = await contactServices.getContacts({
    page,
    perPage,
    sortBy,
    sortOrder,
    filter,
    userId
  });

  res.json({
    status: 200,
    message: 'Successfully found contacts!',
    data,
  });
};

export const getContactByIDController = async (req, res) => {
  const { id: contactId } = req.params;
  const { _id: userId } = req.user;

  const data = await contactServices.getContactByID(contactId, userId);

  if (!data) {
    throw createHttpError(404, 'Contact not found');
  }

  res.json({
    status: 200,
    message: `Successfully found contact with id ${contactId}`,
    data,
  });
};

export const addContactController = async (req, res) => {
  const { _id: userId } = req.user;
  let photo = null;
  if (req.file) {
    if (enableCloudinary === 'true') {
      photo = await saveFileToCloudinary(req.file, 'photos');
    }
    else {
    await saveFileToUploadDir(req.file);
    photo = path.join(req.file.filename);
    }
  }
  const data = await contactServices.addContact({ ...req.body, photo, userId });

  res.status(201).json({
    status: 201,
    message: 'Successfully created a contact!',
    data,
  });
};

export const patchContactController = async (req, res) => {
  const { id: contactId } = req.params;
  const { _id: userId } = req.user;

  let photo = null;
  if (req.file) {
    if (enableCloudinary === 'true') {
      photo = await saveFileToCloudinary(req.file, 'photos');
    } else {
      await saveFileToUploadDir(req.file);
      photo = path.join(req.file.filename);
    }
  }

  const result = await contactServices.updateContact(
    { contactId, userId },
    {...req.body,photo},
  );

  if (!result) {
    throw createHttpError(404, 'Contact not found');
  }

  res.json({
    status: 200,
    message: 'Successfully patched a contact!',
    data: result.data,
  });
};

export const deleteContactControler = async (req, res) => {
  const { id: contactId } = req.params;
  const { _id: userId } = req.user;
  const data = await contactServices.deleteContact(contactId, userId);

  if (!data) {
    throw createHttpError(404, 'Contact not found');
  }
  res.status(204).send();
};
