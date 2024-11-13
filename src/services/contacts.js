import ContactCollection from '../db/Contacts.js';
import { calculatePaginationData } from '../utils/calculatePaginationData.js';

export const getContacts = async ({
  page = 1,
  perPage = 10,
  sortBy = '_id',
  sortOrder = 'asc',
  filter = {},
}) => {
  const skip = (page - 1) * perPage;
  const query = ContactCollection.find()
    .skip(skip)
    .limit(perPage)
    .sort({ [sortBy]: sortOrder });
  if (filter.contactType) {
    query.where('contactType').equals(filter.contactType);
  }
  if (filter.isFavourite !== undefined) {
    query.where('isFavourite').equals(filter.isFavourite);
  }
  const data = await query;
  const totalItems = await ContactCollection.countDocuments();
  const paginationData = calculatePaginationData({ page, perPage, totalItems });
  return {
    data,
    ...paginationData,
  };
};

export const getContactByID = (id) => ContactCollection.findById(id);

export const addContact = (payload) => ContactCollection.create(payload);

export const updateContact = async ({ id, payload, options = {} }) => {
  const rawResult = await ContactCollection.findByIdAndUpdate(id, payload, {
    ...options,
    new: true,
    includeResultMetadata: true,
  });

  if (!rawResult || !rawResult.value) return null;

  return {
    data: rawResult.value,
    isNew: Boolean(rawResult.lastErrorObject.upserted),
  };
};

export const deleteContact = (filter) =>
  ContactCollection.findByIdAndDelete(filter);
