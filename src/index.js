import { setupServer } from './server.js';
import { initMongoConnection } from './db/initMongoConnection.js';
import { createDirIfNotExist } from './utils/createDirIfNotExist.js';

import { TEMP_UPLOAD_DIR, UPLOAD_DIR } from './constants/index.js';

const boostrap = async () => {
  await initMongoConnection();
  createDirIfNotExist(TEMP_UPLOAD_DIR);
  createDirIfNotExist(UPLOAD_DIR);
  setupServer();
};

boostrap();
