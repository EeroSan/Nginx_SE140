const request = require('supertest');
const { expect } = require('chai');
const nock = require('nock');
const path = require('path');
let app; // To hold the Express app


describe('API Gateway Tests', function () {
    before(function () {
      // Dynamically import the app for testing
      const gatewayPath = path.resolve(__dirname, '../src/gateway')
      console.log("gatewayPath", gatewayPath);
      app = require(gatewayPath); // Adjust based on your app entry file
    });

    beforeEach(function () {

      const sysinfo = {ipAddress: "0.0.0.0",
        uptime: "2h",
        diskSpace: "2gb",
        runningProcesses: "word"};
      nock('http://service1')
          .get('/')
          .reply(200, 
            { service: sysinfo, service2: sysinfo });

      // nock('http://service2')
      //     .get('/state')
      //     .reply(200, { message: 'Service2 State' });

      // nock('http://nginx')
      //     .get('/health')
      //     .reply(200, { status: 'healthy' });
    });
    afterEach(function () {
      // Clean up nock after each test
      nock.cleanAll();
      });

  
    describe('GET /state', function () {
      it('should return the current state', async function () {
        const res = await request(app).get('/state').set('Accept', 'text/plain');
        expect(res.status).to.equal(200);
      });
    });

    //PUT /state
    describe('PUT /state', function () {
      it('should update the state to INIT', async function () {
      const res = await request(app).put('/state')
      .send("INIT")
      .set('Content-Type', 'text/plain') // Explicitly set Content-Type
      .set('Accept', 'text/plain');     // Ensure the response is plain text
      expect(res.status).to.equal(200);
      expect(res.text).to.equal('INIT');
      });
    
      it('should update the state to PAUSED', async function () {
      const res = await request(app).put('/state')
      .send("PAUSED")
      .set('Content-Type', 'text/plain')
      .set('Accept', 'text/plain');
      expect(res.status).to.equal(200);
      expect(res.text).to.equal('PAUSED');
      });
    
      it('should update the state to RUNNING', async function () {
      const res = await request(app).put('/state')
      .send("RUNNING")
      .set('Content-Type', 'text/plain')
      .set('Accept', 'text/plain');
      expect(res.status).to.equal(200);
      expect(res.text).to.equal('RUNNING');
      });
    
      it('should update the state to SHUTDOWN', async function () {
      const res = await request(app).put('/state')
      .send("SHUTDOWN")
      .set('Content-Type', 'text/plain')
      .set('Accept', 'text/plain');
      expect(res.status).to.equal(200);
      expect(res.text).to.equal('SHUTDOWN');
      });
    });

    // GET /request
    describe('GET /request', function () {
      it('should return request response', async function () {
        const res = await request(app).get('/request')
        .set('Accept', 'text/plain');
        expect(res.status).to.equal(200);
        expect(res.text).to.contain("service");

      })

    });
    
    
  
  });