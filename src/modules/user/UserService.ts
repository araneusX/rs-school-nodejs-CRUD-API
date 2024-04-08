import { validate as validateId } from 'uuid';
import { UserData, Service, Storage } from '../../types.js';
import { logger, validateUserCreateObject, validateUserUpdateObject } from '../../utils/index.js';
import { InternalError } from '../index.js';
import { InternalErrorCodes, InternalErrorMessages } from '../../constants/index.js';

export class UserService implements Service<UserData> {
  private storage: Storage<UserData>;

  constructor({ storage }: { storage: Storage<UserData> }) {
    this.storage = storage;
  }

  addItem(item?: Record<string, unknown> | null | undefined) {
    if (!validateUserCreateObject(item)) {
      throw new InternalError({
        message: InternalErrorMessages.InvalidUserData,
        code: InternalErrorCodes.InvalidInputData,
      });
    }

    const user = this.storage.addItem({ ...item, hobbies: item.hobbies ?? [] });

    const { id, ...userData } = user;
    logger.success({
      result: `(C) Created user | ID=${id} | ${JSON.stringify(userData)}`,
    });

    return user;
  }

  updateItem(id?: string | null | undefined, item?: Partial<UserData> | null | undefined) {
    if (!id || !validateId(id)) {
      throw new InternalError({
        message: InternalErrorMessages.InvalidUserId,
        code: InternalErrorCodes.InvalidInputData,
      });
    }

    if (!validateUserUpdateObject(item)) {
      throw new InternalError({
        message: InternalErrorMessages.InvalidUserData,
        code: InternalErrorCodes.InvalidInputData,
      });
    }

    const user = this.storage.updateItem(id, item);

    const { id: userId, ...userData } = user;
    logger.success({
      result: `(U) Updated user wit ID=${userId} | ${JSON.stringify(userData)}`,
    });

    return user;
  }

  getItemById(id?: string | null | undefined) {
    if (!id || !validateId(id)) {
      throw new InternalError({
        message: InternalErrorMessages.InvalidUserId,
        code: InternalErrorCodes.InvalidInputData,
      });
    }

    const data = this.storage.getItemById(id);

    if (!data) {
      throw new InternalError({ message: InternalErrorMessages.UserNotExist, code: InternalErrorCodes.ItemNotExist });
    }

    const { id: userId, ...userData } = data;
    logger.success({
      result: `(R) Read user wit ID=${userId} | ${JSON.stringify(userData)}`,
    });

    return data;
  }

  getAllItems() {
    const list = this.storage.getAllItems();

    logger.success({
      result: `(R) Read users list | Total items: ${list.length}`,
    });

    return list;
  }

  deleteItem(id?: string | null | undefined) {
    if (!id || !validateId(id)) {
      throw new InternalError({
        message: InternalErrorMessages.InvalidUserId,
        code: InternalErrorCodes.InvalidInputData,
      });
    }

    logger.success({
      result: `(D) Deleted user wit ID=${id}`,
    });

    return this.storage.deleteItem(id);
  }
}
