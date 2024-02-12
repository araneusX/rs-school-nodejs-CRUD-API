import { UserData } from '../types.js';

type TupleUnion<U extends string, R extends unknown[] = []> = {
  [S in U]: Exclude<U, S> extends never ? [...R, S] : TupleUnion<Exclude<U, S>, [...R, S]>;
}[U];

const userDataKeys: TupleUnion<keyof UserData> = ['id', 'username', 'age', 'hobbies'];

export const cleanUserDataObject = <T extends Partial<UserData>>(data: T): Pick<T, keyof UserData> =>
  Object.fromEntries(Object.entries(data).filter(([key]) => (userDataKeys as string[]).includes(key)));
