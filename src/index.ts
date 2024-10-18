import http from 'http';
import { PORT } from './config';

export const server = http.createServer((req, res) => {});

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
