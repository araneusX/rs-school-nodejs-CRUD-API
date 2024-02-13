import { UserController, UserService, UserStorage, Server } from './modules/index.js';

export const app = new Server({
  users: new UserController({
    service: new UserService({
      storage: new UserStorage(),
    }),
  }),
});
