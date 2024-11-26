import * as fs from 'node:fs/promises';

export const createDirIfNotExist = async (url) => {
  try {
    await fs.access(url);
  } catch (error) {
    if (error === 'ENOENT') {
      await fs.mkdir(url);
    }
  }
};
