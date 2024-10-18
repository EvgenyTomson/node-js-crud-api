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

export const users: User[] = [];

export const getAllUsers = () => users;

export const getUserById = (id: string) => users.find((user) => user.id === id);

export const createUser = (username: string, age: number, hobbies: string[]) => {
  const newUser: User = {
    id: uuidv4(),
    username,
    age,
    hobbies,
  };
  users.push(newUser);
  return newUser;
};
