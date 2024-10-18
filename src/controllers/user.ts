import { IncomingMessage, ServerResponse } from 'http';
import { getAllUsers, getUserById, createUser, isValidUser } from '../models/user';
import { sendResponse, parseRequestBody } from '../utils/utils';
import { validate as uuidValidate } from 'uuid';
import { errorMessages } from '../utils/constants';

// To test error handling
// if (Math.random() > 0.2) throw new Error('My custom');

export const handleGetAllUsers = (res: ServerResponse) => {
  const users = getAllUsers();
  sendResponse(res, 200, users);
};

export const handleGetUserById = (res: ServerResponse, userId: string) => {
  if (!uuidValidate(userId)) {
    sendResponse(res, 400, errorMessages.invalidUserId);
    return;
  }
  const user = getUserById(userId);
  if (!user) {
    sendResponse(res, 404, errorMessages.userNotFound);
  } else {
    sendResponse(res, 200, user);
  }
};

export const handleCreateUser = async (req: IncomingMessage, res: ServerResponse) => {
  try {
    const body = await parseRequestBody(req);
    if (isValidUser(body)) {
      const newUser = createUser(body.username, body.age, body.hobbies);
      sendResponse(res, 201, newUser);
    } else {
      sendResponse(res, 400, errorMessages.invalidRequestBody);
    }
  } catch {
    sendResponse(res, 500, errorMessages.internalError);
  }
};
