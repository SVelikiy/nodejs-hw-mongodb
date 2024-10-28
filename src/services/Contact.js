import ContactCollection from "../db/Contacts.js";

export const getContacts = () => ContactCollection.find();

export const getContactByID = id => ContactCollection.findById(id);


