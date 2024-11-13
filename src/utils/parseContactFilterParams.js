import { typeList } from '../constants/contacts.js';

const parseType = (type) => {
  if (typeof type !== 'string') return;

  const isValidType = typeList.includes(type);

  return isValidType ? type.toLowerCase() : undefined;
};

const parseIsFavourite = (value) => {
  if (typeof value !== 'string') return;

  if (value.toLowerCase() === 'true') return true;
  if (value.toLowerCase() === 'false') return false;

  return undefined;
};

export const parseContactFilterParams = ({ contactType, isFavourite }) => {
  const parsedContactType = parseType(contactType);
  const parsedIsFavourite = parseIsFavourite(isFavourite);

  return {
    contactType: parsedContactType,
    isFavourite: parsedIsFavourite,
  };
};
