import ContactCollection from "../db/Contacts.js";

export const getContacts = () => ContactCollection.find();

export const getContactByID = id => ContactCollection.findById(id);

export const addContact = payload => ContactCollection.create(payload);

export const updateContact = async ({ id, payload, options = {} }) => {
    const rawResult = await ContactCollection.findByIdAndUpdate(id, payload, {
        ...options,
        new: true,
        includeResultMetadata: true,
    });

    if (!rawResult || !rawResult.value) return null;

    return {
        data: rawResult.value,
        isNew: Boolean(rawResult.lastErrorObject.upserted)
    };
};

export const deleteContact = filter => ContactCollection.findByIdAndDelete(filter);
