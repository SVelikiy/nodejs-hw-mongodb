import ContactCollection from '../db/Contacts.js';
import { calculatePaginationData } from '../utils/calculatePaginationData.js';

export const getContacts = async ({
  page = 1,
  perPage = 10,
  sortBy = '_id',
  sortOrder = 'asc',
  filter = {},
  userId,
}) => {
  const query = ContactCollection.find({ userId });
  const skip = (page - 1) * perPage;

  if (filter.contactType) {
    query.where('contactType').equals(filter.contactType);
  }
  if (filter.isFavourite !== undefined) {
    query.where('isFavourite').equals(filter.isFavourite);
  }
  const totalItems = await ContactCollection.find().merge(query).countDocuments();
  const data = await query.skip(skip).limit(perPage).sort({ [sortBy]: sortOrder });
  const paginationData = calculatePaginationData({ page, perPage, totalItems });

    return {
      data,
      ...paginationData,
    };
};

export const getContactByID = async (contactId, userId) => {
  const contact = await ContactCollection.findOne({
    _id: contactId,
    userId,
  });
  return contact;
};
export const addContact = (payload) => ContactCollection.create(payload);

export const updateContact = async ({contactId, userId }, payload, options = {} ) => {
  const rawResult = await ContactCollection.findOneAndUpdate(
    { _id : contactId, userId :userId },
    payload,
    {
      ...options,
      new: true,
      includeResultMetadata: true,
    },
  );

  if (!rawResult || !rawResult.value) return null;

  return {
    data: rawResult.value,
    isNew: Boolean(rawResult.lastErrorObject.upserted),
  };
};

export const deleteContact = (contactId, userId) => {
  const contact = ContactCollection.findOneAndDelete({
    _id: contactId,
    userId,
  });
  return contact;
};
