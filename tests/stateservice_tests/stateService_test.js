const chai = require('chai');
const chaiHttp = require('chai-http');
const nock = require('nock');
const path = require('path');
const sinon = require('sinon');
let app;
let State;

chai.use(chaiHttp);
const { expect } = chai;

describe('StateService API Tests', () => {
  const mongoHost = process.env.MONGO_IP || 'localhost';
  const mongoPort = process.env.MONGO_PORT || '27017';
  const mongoCollection = process.env.MONGO_COLLECTION || 'test';

  before(() => {
    const serverPath = path.resolve(__dirname, '../src/server')
    console.log("serverPath", serverPath);
    app = require(serverPath);
    const statePath = path.resolve(__dirname, '../src/models/State')
    
    State = require(statePath);



    // Mock MongoDB calls with Nock
    nock(`http://${mongoHost}:${mongoPort}`)
      .persist()
      .get(`/${mongoCollection}`)
      .reply(200, { message: 'Mocked MongoDB GET request' })
      .post(`/${mongoCollection}`)
      .reply(200, { message: 'Mocked MongoDB POST request' });
  });

  describe('POST /login', () => {
    it('should set login state to true', async () => {
      // Mock State.findOne and State.save
      const findOneStub = sinon.stub(State, 'findOne').resolves({ login_state: false, save: sinon.stub() });

      const res = await chai.request(app).post('/login');
      expect(res).to.have.status(200);
      expect(res.body).to.have.property('message', 'Login state updated.');
      expect(res.body).to.have.property('login_state', true);

      findOneStub.restore();
    });

    it('should return 404 if state is not initialized', async () => {
      const findOneStub = sinon.stub(State, 'findOne').resolves(null);

      const res = await chai.request(app).post('/login');
      expect(res).to.have.status(404);
      expect(res.body).to.have.property('message', 'State not initialized.');

      findOneStub.restore();
    });
  });

  describe('GET /login', () => {
    it('should return the current login state', async () => {
      const findOneStub = sinon.stub(State, 'findOne').resolves({ login_state: true });

      const res = await chai.request(app).get('/login');
      expect(res).to.have.status(200);
      expect(res.body).to.have.property('login_state', true);

      findOneStub.restore();
    });

    it('should return 404 if state is not initialized', async () => {
      const findOneStub = sinon.stub(State, 'findOne').resolves(null);

      const res = await chai.request(app).get('/login');
      expect(res).to.have.status(404);
      expect(res.body).to.have.property('message', 'State not initialized.');

      findOneStub.restore();
    });
  });

  describe('PUT /system-state', () => {
    it('should update the system state', async () => {
      const findOneStub = sinon.stub(State, 'findOne').resolves({ system_state: 'INIT', save: sinon.stub() });

      const res = await chai
        .request(app)
        .put('/system-state')
        .send({ system_state: 'RUNNING' });

      expect(res).to.have.status(200);
      expect(res.body).to.have.property('message', 'System state updated.');
      expect(res.body).to.have.property('system_state', 'RUNNING');

      findOneStub.restore();
    });

    it('should return 400 for invalid system state', async () => {
      const res = await chai
        .request(app)
        .put('/system-state')
        .send({ system_state: 'INVALID_STATE' });

      expect(res).to.have.status(400);
      expect(res.body).to.have.property('message', 'Invalid system_state.');
    });

    it('should return 404 if state is not initialized', async () => {
      const findOneStub = sinon.stub(State, 'findOne').resolves(null);

      const res = await chai
        .request(app)
        .put('/system-state')
        .send({ system_state: 'RUNNING' });

      expect(res).to.have.status(404);
      expect(res.body).to.have.property('message', 'State not initialized.');

      findOneStub.restore();
    });
  });

  describe('GET /system-state', () => {
    it('should return the current system state', async () => {
      const findOneStub = sinon.stub(State, 'findOne').resolves({ system_state: 'RUNNING' });

      const res = await chai.request(app).get('/system-state');
      expect(res).to.have.status(200);
      expect(res.body).to.have.property('system_state', 'RUNNING');

      findOneStub.restore();
    });

    it('should return 404 if state is not initialized', async () => {
      const findOneStub = sinon.stub(State, 'findOne').resolves(null);

      const res = await chai.request(app).get('/system-state');
      expect(res).to.have.status(404);
      expect(res.body).to.have.property('message', 'State not initialized.');

      findOneStub.restore();
    });
  });

  after(() => {
    nock.cleanAll();
  });
});
