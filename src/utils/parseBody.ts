import { IncomingMessage } from 'http';

export const parseBody = (req: IncomingMessage) => {
  return new Promise<Record<string, unknown>>((resolve, reject) => {
    let body = '';

    req.on('data', (chunk) => {
      body += chunk;
    });

    req.on('end', () => {
      if (!body) {
        resolve({} as Record<string, unknown>);
        return;
      }

      try {
        resolve(JSON.parse(body));
      } catch (error) {
        reject(error);
      }
    });
  });
};
