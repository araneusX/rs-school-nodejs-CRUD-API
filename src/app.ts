import { UserController, UserService, UserStorage, Server } from './modules/index.js';

new Server({
  users: new UserController({
    service: new UserService({
      storage: new UserStorage(),
    }),
  }),
});
