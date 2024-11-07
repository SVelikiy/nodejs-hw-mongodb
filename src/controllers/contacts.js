import * as contactServices from '../services/contacts.js';
import createHttpError from 'http-errors';

export const getContactsController = async (req, res) => {
    const data = await contactServices.getContacts();

    res.json({
      status: 200,
      message: 'Successfully found contacts!',
      data,
    });

};

export const getContactByIDController = async (req, res) => {
    const { id } = req.params;
    const data = await contactServices.getContactByID(id);
      if (!data) {
          throw createHttpError(404, 'Contact not found');
    }

    res.json({
      status: 200,
      message: `Successfully found contact with id ${id}`,
      data,
    });
};

export const addContactController = async (req, res) => {
  const data = await contactServices.addContact(req.body);

  res.status(201).json({
    status: 201,
    message: 'Successfully created a contact!',
    data,
  });
};

export const patchContactController = async (req, res) => {
  const { id } = req.params;

  const result = await contactServices.updateContact({ id, payload: req.body });

  if (!result) {
   throw createHttpError(404, 'Contact not found');
  }

  res.json({
    status: 200,
    message: 'Successfully patched a contact!',
    data : result.data,
  });
};

export const deleteContactControler = async (req, res) => {
  const { id } = req.params;
  const data = await contactServices.deleteContact(id);

  if (!data) {
    throw createHttpError(404, 'Contact not found');
  }
  res.status(204).send();
};