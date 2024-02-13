import http from 'http';
import url from 'url';
import { HttpCode } from '../../constants/HttpCode.js';
import { InternalErrorMessages } from '../../constants/InternalErrorMessages.js';
import { Controller, Method } from '../../types.js';
import { InternalError } from '../index.js';
import dotenv from 'dotenv';
import { logger } from '../../utils/logger.js';

dotenv.config();

const PORT = process.env.PORT || 4000;

export class Server {
  constructor(router: { [resource: string]: Controller }) {
    const server = http.createServer(async (req, res) => {
      logger.request({ method: req.method, url: req.url, port: PORT });

      const { method } = req;
      const { pathname: route } = url.parse(req.url ?? '', true);

      if (!route) {
        res.writeHead(HttpCode.NotFound);
        res.end(InternalErrorMessages.ResourceNotExist);
        return;
      }

      if (!method) {
        res.writeHead(HttpCode.MethodNotAllowed);
        res.end(InternalErrorMessages.MethodNotAllowed);
        return;
      }

      const [_, prefix, resource, ...segments] = route.split('/');

      const controller = router[resource];

      if (prefix !== 'api' || !controller) {
        res.writeHead(HttpCode.NotFound);
        res.end(InternalErrorMessages.ResourceNotExist);
        return;
      }

      try {
        await controller.handleRoute({
          route: segments.join('/'),
          method: method.toLowerCase() as Method,
          req,
          res,
        });
      } catch (error) {
        const { code, message } = new InternalError(error).getHttpError();
        res.writeHead(code);
        res.end(message);
        logger.error({ code, message });
      }
    });

    server.listen(PORT, () => console.log(`server listening on port: ${PORT}`));

    return server;
  }
}
