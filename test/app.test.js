require('dotenv').config();

const request = require('supertest');
const app = require('../lib/app');
const connect = require('../lib/utils/connect');
const mongoose = require('mongoose');
const Note = require('../lib/models/Note');

describe('app routes', () => {
  beforeAll(() => {
    connect();
  });

  beforeEach(() => {
    return mongoose.connection.dropDatabase();
  });

  afterAll(() => {
    return mongoose.connection.close();
  });

  it('creates a route', () => {
    return request(app)
      .post('/api/v1/notes')
      .send({ title:'Hello', body: 'Task' })
      .then(res => {
        expect(res.body).toEqual({
          _id: expect.any(String),
          title: 'Hello',
          body: 'Task',
          __v: 0
        });
      });
  });

  it('can get all notes', async() => {
    const notes = await Note.create([
      { title: 'one', body: 'task a' },
      { title: 'two', body: 'task b' },
      { title: 'three', body: 'task c' },
    ]);
    return request(app)
      .get('/api/v1/notes')
      .then(res => {
        const noteJSON = JSON.parse(JSON.stringify(notes));
        noteJSON.forEach((note => {
          expect(res.body).toContainEqual({ title: note.title, body: note.body, _id: note._id, __v: 0 });
        }));
      });
  });
});
