import http from 'http';
import url from 'url';
import { HttpCode } from '../constants/HttpCode.js';
import { InternalErrorMessages } from '../constants/InternalErrorMessages.js';
import { Controller, Method } from '../types.js';
import { InternalError } from '../modules/index.js';

const PORT = process.env.PORT || 4000;

export const createServer = (router: { [resource: string]: Controller }) => {
  const server = http.createServer(async (req, res) => {
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

    const [_, prefix, resource, ...subroute] = route.split('/');

    const controller = router[resource];

    if (prefix !== 'api' || !controller) {
      res.writeHead(HttpCode.NotFound);
      res.end(InternalErrorMessages.ResourceNotExist);
      return;
    }

    try {
      await controller.handleRoute({
        route: subroute.join('/'),
        method: method.toLowerCase() as Method,
        req,
        res,
      });
    } catch (error) {
      const { code, message } = new InternalError(error).getHttpError();
      if (error instanceof InternalError) {
        res.writeHead(code);
        res.end(message);
      }
    }
  });

  server.listen(PORT, () => console.log(`server listening on port: ${PORT}`));
};
