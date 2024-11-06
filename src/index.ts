import http from 'http';
import { userRouter } from './routes/user';
import { PORT } from './config';
import { sendResponse } from './utils/utils';
import { errorMessages } from './utils/constants';

export const server = http.createServer((req, res) => {
  try {
    userRouter(req, res);
  } catch {
    sendResponse(res, 500, errorMessages.internalError);
  }
});

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
