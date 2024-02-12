import { validate as validateId } from 'uuid';
import { UserData, Service, Storage } from '../../types.js';
import { validateUserCreateObject, validateUserUpdateObject } from '../../utils/index.js';
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

    return this.storage.addItem({ ...item, hobbies: item.hobbies ?? [] });
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

    return this.storage.updateItem(id, item);
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

    return data;
  }

  getAllItems() {
    return this.storage.getAllItems();
  }

  deleteItem(id?: string | null | undefined) {
    if (!id || !validateId(id)) {
      throw new InternalError({
        message: InternalErrorMessages.InvalidUserId,
        code: InternalErrorCodes.InvalidInputData,
      });
    }

    return this.storage.deleteItem(id);
  }
}
