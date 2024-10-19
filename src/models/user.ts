import { v4 as uuidv4 } from 'uuid';

export interface User {
  id: string;
  username: string;
  age: number;
  hobbies: string[];
}

type UserRequestBody = Omit<User, 'id'>;

export const isValidUser = (body: unknown): body is UserRequestBody => {
  if (typeof body === 'object' && body !== null) {
    return (
      'username' in body &&
      typeof body.username === 'string' &&
      body.username.length > 0 &&
      'age' in body &&
      typeof body.age === 'number' &&
      !Number.isNaN(body.age) &&
      'hobbies' in body &&
      Array.isArray(body.hobbies)
    );
  }
  return false;
};

export const users = new Map<string, User>();

export const getAllUsers = () => Array.from(users.values());

export const getUserById = (id: string) => users.get(id);

export const createUser = (userData: UserRequestBody) => {
  const userId = uuidv4();
  const newUser: User = { id: userId, ...userData };
  users.set(userId, newUser);
  return newUser;
};

export const updateUser = (userToUpdate: User) => {
  if (users.has(userToUpdate.id)) {
    users.set(userToUpdate.id, userToUpdate);
    return userToUpdate;
  }
  return null;
};

export const deleteUser = (id: string) => users.delete(id);
