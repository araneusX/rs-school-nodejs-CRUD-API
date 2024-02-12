import { IncomingMessage, ServerResponse } from 'http';
import { HttpCode } from '../../constants/HttpCode.js';
import { Controller, Method, Service, StorageRecord } from '../../types.js';
import { InternalErrorMessages } from '../../constants/InternalErrorMessages.js';
import { parseBody } from '../../utils/parseBody.js';

export class UserController<T extends StorageRecord> implements Controller {
  private service: Service<T>;

  constructor({ service }: { service: Service<T> }) {
    this.service = service;
  }

  async handleRoute({
    req,
    res,
    route,
    method,
  }: {
    route: string;
    req: IncomingMessage;
    res: ServerResponse;
    method: Method;
  }) {
    const segments = route
      .replace(/^\//, '')
      .replace(/\/$/, '')
      .split('/')
      .filter((value) => value);

    if (segments.length > 1) {
      res.writeHead(HttpCode.NotFound);
      res.end(InternalErrorMessages.ResourceNotExist);
      return;
    }

    if (!segments.length) {
      switch (method) {
        case 'post': {
          const data = await parseBody(req);

          const user = this.service.addItem(data);

          res.setHeader('Content-Type', 'application/json');
          res.writeHead(HttpCode.Created);
          res.end(JSON.stringify(user));
          break;
        }
        case 'get': {
          const users = this.service.getAllItems();
          res.setHeader('Content-Type', 'application/json');
          res.writeHead(HttpCode.Ok);
          res.end(JSON.stringify(users));

          break;
        }
        default:
          res.writeHead(HttpCode.MethodNotAllowed);
          res.end(InternalErrorMessages.MethodNotAllowed);
          break;
      }

      return;
    }

    const [id] = segments;

    switch (method) {
      case 'get': {
        const user = this.service.getItemById(id);

        res.setHeader('Content-Type', 'application/json');
        res.writeHead(HttpCode.Ok);
        res.end(JSON.stringify(user));
        break;
      }
      case 'put': {
        const data = await parseBody(req);

        const user = this.service.updateItem(id, data);

        res.setHeader('Content-Type', 'application/json');
        res.writeHead(HttpCode.Ok);
        res.end(JSON.stringify(user));
        break;
      }
      case 'delete':
        this.service.deleteItem(id);

        res.writeHead(HttpCode.Deleted);
        res.end();
        break;
      default:
        res.writeHead(HttpCode.MethodNotAllowed);
        res.end(InternalErrorMessages.MethodNotAllowed);
        break;
    }
  }
}
