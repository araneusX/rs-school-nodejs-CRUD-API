import { Server } from 'http';
import { app } from './app.js';
import request from 'supertest';
import { CreateUserData, UpdateUserData } from './types.js';
import { Storage } from './modules/storage/Storage.js';
import { v4 } from 'uuid';

const createMarfaData: CreateUserData = {
  username: 'Marfa',
  age: 81,
};

const createPeterData: CreateUserData = {
  username: 'Peter',
  age: 18,
  hobbies: ['coding'],
};

const updateUserData: UpdateUserData = {
  hobbies: ['sleeping', 'cocking'],
};

const server = app as Server;

describe('Scenario 1: Happy path', () => {
  afterEach(() => {
    Storage.cleanStorageData();
  });

  afterAll(() => {
    server.close();
  });

  it('POST api/users return status code 201 if correct user data sent', async () => {
    const res = await request(server).post('/api/users').send(createMarfaData);

    expect(res.statusCode).toEqual(201);
  });

  it('GET api/users/${userId} return user data', async () => {
    const {
      body: { id },
    } = await request(server).post('/api/users').send(createPeterData);

    const res = await request(server)
      .get('/api/users/' + id)
      .send();

    expect(res.body).toEqual({ ...createPeterData, id });
  });

  it('GET api/users return list if users', async () => {
    const {
      body: { id },
    } = await request(server).post('/api/users').send(createPeterData);

    const res = await request(server).get('/api/users').send();

    expect(res.body).toEqual([{ ...createPeterData, id }]);
  });

  it('PUT api/users/${userId} return updated user data', async () => {
    const {
      body: { id },
    } = await request(server).post('/api/users').send(createPeterData);

    const res = await request(server)
      .put('/api/users/' + id)
      .send(updateUserData);

    expect(res.body).toEqual({ ...createPeterData, ...updateUserData, id });
  });

  it('DELETE api/users/${userId} delete user data', async () => {
    const {
      body: { id },
    } = await request(server).post('/api/users').send(createPeterData);

    await request(server)
      .delete('/api/users/' + id)
      .send();

    const res = await request(server)
      .get('/api/users/' + id)
      .send();

    expect(res.statusCode).toEqual(404);
  });
});

describe('Scenario 2: Invalid data in request', () => {
  afterEach(() => {
    Storage.cleanStorageData();
  });

  afterAll(() => {
    server.close();
  });

  it('POST api/users return status code 400 if incorrect user data sent', async () => {
    const res = await request(server).post('/api/users').send({});

    expect(res.statusCode).toEqual(400);
  });

  it('GET api/users/${userId} return status code 400 if invalid uuid sent', async () => {
    const {
      body: { id },
    } = await request(server).post('/api/users').send(createPeterData);

    const res = await request(server)
      .get('/api/users/' + id + '-boss')
      .send();

    expect(res.statusCode).toEqual(400);
  });

  it('PUT api/users/${userId} return status code 400 if incorrect user data sent', async () => {
    const {
      body: { id },
    } = await request(server).post('/api/users').send(createPeterData);

    const res = await request(server)
      .put('/api/users/' + id)
      .send({ age: 'boss' });

    expect(res.statusCode).toEqual(400);
  });

  it('PUT return status code 400 if user not exists', async () => {
    const res = await request(server)
      .put('/api/users/' + v4())
      .send({ age: 'boss' });

    expect(res.statusCode).toEqual(400);
  });
});

describe('Scenario 3: Invalid api urls', () => {
  afterEach(() => {
    Storage.cleanStorageData();
  });

  afterAll(() => {
    server.close();
  });

  it('GET /api return status code 404', async () => {
    const res = await request(server).get('/api').send();

    expect(res.statusCode).toEqual(404);
  });

  it('POST api/users/${userId} return status code 405', async () => {
    const res = await request(server)
      .post('/api/users/' + v4())
      .send({});

    expect(res.statusCode).toEqual(405);
  });

  it('GET api/users/${userId}/age return status code 404', async () => {
    const {
      body: { id },
    } = await request(server).post('/api/users').send(createPeterData);

    const res = await request(server)
      .get('/api/users/' + id + '/age')
      .send();

    expect(res.statusCode).toEqual(404);
  });
});
