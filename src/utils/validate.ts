import { CreateUserData, UpdateUserData } from '../types.js';

const validateHobbies = (data: Record<string, unknown>) => {
  if (!('hobbies' in data)) {
    return true;
  }

  if (!Array.isArray(data.hobbies)) {
    return true;
  }

  return data.hobbies.every((value) => typeof value === 'string');
};

export const validateUserCreateObject = (data?: Record<string, unknown> | null): data is CreateUserData => {
  if (!data) {
    return false;
  }

  const userData = data as Partial<Record<keyof CreateUserData, unknown>>;
  const isValidUserName = typeof userData.username === 'string';
  const isValidAge = typeof userData.age === 'number';
  const isValidHobbies = validateHobbies(data);

  return isValidUserName && isValidAge && isValidHobbies;
};

export const validateUserUpdateObject = (data?: Record<string, unknown> | null): data is UpdateUserData => {
  if (!data) {
    return false;
  }

  const userData = data as Partial<Record<keyof UpdateUserData, unknown>>;
  const isValidUserName = !('username' in data) || typeof userData.username === 'string';
  const isValidAge = !('age' in data) || typeof userData.age === 'number';
  const isValidHobbies = validateHobbies(data);

  return isValidUserName && isValidAge && isValidHobbies;
};
