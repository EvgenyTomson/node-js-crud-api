import { IncomingMessage, ServerResponse } from 'http';
import { User } from '../models/user';

export const sendResponse = (
  res: ServerResponse,
  statusCode: number,
  data: User | User[] | { message: string } | null
) => {
  res.writeHead(statusCode, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(data));
};

export const parseRequestBody = async (req: IncomingMessage): Promise<unknown> => {
  return new Promise<unknown>((resolve, reject) => {
    let body = '';
    req.on('data', (chunk) => {
      body += chunk.toString();
    });
    req.on('end', () => {
      try {
        resolve(JSON.parse(body));
      } catch (e) {
        reject(e);
      }
    });
  });
};
