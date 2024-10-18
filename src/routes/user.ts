import { IncomingMessage, ServerResponse } from 'http';
import { handleGetAllUsers, handleGetUserById, handleCreateUser } from '../controllers/user';
import { sendResponse } from '../utils/utils';
import { errorMessages } from '../utils/constants';

export const userRouter = (req: IncomingMessage, res: ServerResponse) => {
  const { url, method = 'GET' } = req;

  if (!url) {
    sendResponse(res, 404, errorMessages.notFound);
    return;
  }

  if (url === '/api/users' && method === 'GET') {
    handleGetAllUsers(res);
  } else if (url.startsWith('/api/users/') && method === 'GET') {
    const userId = url.split('/')[3];
    handleGetUserById(res, userId);
  } else if (url === '/api/users' && method === 'POST') {
    handleCreateUser(req, res);
  } else {
    sendResponse(res, 404, errorMessages.notFound);
  }
};
