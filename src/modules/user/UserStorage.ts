import { v4 as uuid } from 'uuid';
import { UserData, Storage } from '../../types.js';
import { cleanUserDataObject } from '../../utils/index.js';
import { InternalError } from '../index.js';
import { InternalErrorCodes, InternalErrorMessages } from '../../constants/index.js';

export class UserStorage implements Storage<UserData> {
  private storage: Map<string, UserData> = new Map();

  addItem(item: Omit<UserData, 'id'>) {
    const data = cleanUserDataObject(item);
    const id = uuid();
    const user = { ...data, id };
    this.storage.set(id, user);

    return user;
  }

  updateItem(id: string, item: Partial<UserData>) {
    const data = this.storage.get(id);

    if (!data) {
      throw new InternalError({ message: InternalErrorMessages.UserNotExist, code: InternalErrorCodes.ItemNotExist });
    }

    const newData = cleanUserDataObject(item);

    const user = { ...data, ...newData, id };
    this.storage.set(id, user);

    return user;
  }

  getItemById(id: string) {
    const data = this.storage.get(id);

    return data || null;
  }

  getAllItems() {
    return Array.from(this.storage).map(([_, data]) => data);
  }

  deleteItem(id: string) {
    this.storage.delete(id);
  }
}
