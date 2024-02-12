import { UserController, UserService, UserStorage } from './modules/index.js';
import { createServer } from './utils/createServer.js';

createServer({
  users: new UserController({
    service: new UserService({
      storage: new UserStorage(),
    }),
  }),
});
