const request = require('supertest');
const { expect } = require('chai');
const path = require('path');
let app; // To hold the Express app


describe('API Gateway Tests', function () {
    before(function () {
      // Dynamically import the app for testing
      const gatewayPath = path.resolve(__dirname, '../src/gateway')
      console.log("gatewayPath", gatewayPath);
      app = require(gatewayPath); // Adjust based on your app entry file
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
        const res = await request(app).put('/state').send({ state: 'INIT' }).set('Accept', 'application/json');
        expect(res.status).to.equal(200);
        expect(res.body.state).to.equal('INIT');
      });
  
      it('should update the state to PAUSED', async function () {
        const res = await request(app).put('/state').send({ state: 'PAUSED' }).set('Accept', 'application/json');
        expect(res.status).to.equal(200);
        expect(res.body.state).to.equal('PAUSED');
      });
  
      it('should update the state to RUNNING', async function () {
        const res = await request(app).put('/state').send({ state: 'RUNNING' }).set('Accept', 'application/json');
        expect(res.status).to.equal(200);
        expect(res.body.state).to.equal('RUNNING');
      });
  
      it('should update the state to SHUTDOWN', async function () {
        const res = await request(app).put('/state').send({ state: 'SHUTDOWN' }).set('Accept', 'application/json');
        expect(res.status).to.equal(200);
        expect(res.body.state).to.equal('SHUTDOWN');
      });
    });
    
    
  
  });