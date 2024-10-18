import { IncomingMessage, ServerResponse } from 'http';
import { getAllUsers, getUserById, createUser, isValidUser, updateUser, deleteUser } from '../models/user';
import { sendResponse, parseRequestBody } from '../utils/utils';
import { validate as uuidValidate } from 'uuid';
import { errorMessages } from '../utils/constants';

// To test error handling
// if (Math.random() > 0.2) throw new Error('My custom');

export const handleGetAllUsers = (res: ServerResponse) => {
  try {
    const users = getAllUsers();
    sendResponse(res, 200, users);
  } catch {
    sendResponse(res, 500, errorMessages.internalError);
  }
};

export const handleGetUserById = (res: ServerResponse, userId: string) => {
  try {
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
  } catch {
    sendResponse(res, 500, errorMessages.internalError);
  }
};

export const handleCreateUser = async (req: IncomingMessage, res: ServerResponse) => {
  try {
    const body = await parseRequestBody(req);
    if (isValidUser(body)) {
      const newUser = createUser(body);
      sendResponse(res, 201, newUser);
    } else {
      sendResponse(res, 400, errorMessages.invalidRequestBody);
    }
  } catch {
    sendResponse(res, 500, errorMessages.internalError);
  }
};

export const handleUpdateUser = async (req: IncomingMessage, res: ServerResponse, userId: string) => {
  try {
    if (!uuidValidate(userId)) {
      sendResponse(res, 400, errorMessages.invalidUserId);
      return;
    }

    const body = await parseRequestBody(req);
    if (isValidUser(body)) {
      const updatedUser = updateUser({ id: userId, ...body });
      if (updatedUser) {
        sendResponse(res, 200, updatedUser);
      } else {
        sendResponse(res, 404, errorMessages.userNotFound);
      }
    } else {
      sendResponse(res, 400, errorMessages.invalidRequestBody);
    }
  } catch {
    sendResponse(res, 500, errorMessages.internalError);
  }
};

export const handleDeleteUser = (res: ServerResponse, userId: string) => {
  try {
    if (!uuidValidate(userId)) {
      sendResponse(res, 400, errorMessages.invalidUserId);
      return;
    }

    const userDeleted = deleteUser(userId);
    if (userDeleted) {
      sendResponse(res, 204, null);
    } else {
      sendResponse(res, 404, errorMessages.userNotFound);
    }
  } catch {
    sendResponse(res, 500, errorMessages.internalError);
  }
};
