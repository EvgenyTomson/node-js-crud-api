import request from 'supertest';
import { server } from '../index';
import { v4 as uuidv4 } from 'uuid';
import { errorMessages } from '../utils/constants';

describe('User API', () => {
  afterAll(() => {
    server.close();
  });

  test('should return 404 code and right message for not existing request path', async () => {
    const response = await request(server).get('/api/wrong-path');

    expect(response.status).toBe(404);
    expect(response.body).toEqual(errorMessages.notFound);
  });

  test('should return an empty array when there are no users', async () => {
    const response = await request(server).get('/api/users');

    expect(response.status).toBe(200);
    expect(response.body).toEqual([]);
  });

  test('should return 404 code and right message if there is no such user', async () => {
    const userId = uuidv4();
    const response = await request(server).get(`/api/users/${userId}`);

    expect(response.status).toBe(404);
    expect(response.body).toEqual(errorMessages.userNotFound);
  });

  test(`should return 400 code and right message if user's ID is invalid`, async () => {
    const userId = 'some-invalid-user-id';
    const response = await request(server).get(`/api/users/${userId}`);

    expect(response.status).toBe(400);
    expect(response.body).toEqual(errorMessages.invalidUserId);
  });

  test('should create a new user and return it', async () => {
    const newUser = {
      username: 'TestUser',
      age: 35,
      hobbies: ['reading', 'gaming', 'music'],
    };

    const response = await request(server).post('/api/users').send(newUser);

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('id');
    expect(response.body.username).toBe(newUser.username);
    expect(response.body.age).toBe(newUser.age);
    expect(response.body.hobbies).toEqual(newUser.hobbies);
  });

  test('should return a user by id', async () => {
    const newUser = {
      username: 'TestUser2',
      age: 30,
      hobbies: ['coding', 'running'],
    };

    const createResponse = await request(server).post('/api/users').send(newUser);
    const userId = createResponse.body.id;

    const getResponse = await request(server).get(`/api/users/${userId}`);

    expect(getResponse.status).toBe(200);
    expect(getResponse.body).toEqual({ id: userId, ...newUser });
  });

  test('should update an existing user', async () => {
    const newUser = {
      username: 'UserToUpdate',
      age: 40,
      hobbies: ['music', 'traveling'],
    };

    const createResponse = await request(server).post('/api/users').send(newUser);
    const userId = createResponse.body.id;

    const updatedUser = {
      username: 'UpdatedUser',
      age: 45,
      hobbies: ['photography', 'hiking'],
    };

    const updateResponse = await request(server).put(`/api/users/${userId}`).send(updatedUser);

    expect(updateResponse.status).toBe(200);
    expect(updateResponse.body).toEqual({ id: userId, ...updatedUser });
  });

  test('should delete a user and return status 204', async () => {
    const newUser = {
      username: 'UserToDelete',
      age: 50,
      hobbies: ['writing', 'swimming'],
    };

    const createResponse = await request(server).post('/api/users').send(newUser);
    const userId = createResponse.body.id;

    const deleteResponse = await request(server).delete(`/api/users/${userId}`);
    expect(deleteResponse.status).toBe(204);

    const getResponse = await request(server).get(`/api/users/${userId}`);
    expect(getResponse.status).toBe(404);
  });
});
