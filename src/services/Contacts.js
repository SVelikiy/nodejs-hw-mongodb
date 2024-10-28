import { Schema, model } from 'mongoose';

const contactSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  phoneNumber: {
    type: String,
    required: true,
  },
  email: {
    type: String,
  },
  isFavourite: {
    type: Boolean,
    default: false,
  },
  contactType: {
    type: String,
    enum: ['work', 'home', 'personal'],
    required: true,
    default: 'personal',
  },
  createdAt: {
    type: Date,
    timestamps: true,
  },
  updatedAt: {
    type: Date,
    timestamps: true,
  },
});

const ContactCollection = model('contacts', contactSchema);

export default ContactCollection;
