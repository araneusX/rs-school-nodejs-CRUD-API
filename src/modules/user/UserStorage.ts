import { UserData } from '../../types.js';
import { cleanUserDataObject } from '../../utils/index.js';
import { Storage } from '../storage/Storage.js';

export class UserStorage extends Storage<UserData> {
  constructor() {
    super({ key: 'users' });
  }

  addItem(item: Omit<UserData, 'id'>) {
    const data = cleanUserDataObject(item);

    return super.addItem(data);
  }

  updateItem(id: string, item: Partial<UserData>) {
    const newData = cleanUserDataObject(item);

    return super.updateItem(id, newData);
  }
}
