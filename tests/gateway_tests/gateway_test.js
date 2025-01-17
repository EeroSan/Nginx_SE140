const request = require('supertest');
const { expect } = require('chai');
let app; // To hold the Express app

// const controller = require('../app/src/controller'); // Import the entire module
// const { getIpAddress, getSystemInfo } = controller; // Destructure correctly from the imported module

describe('API Gateway Tests', function () {
    before(function () {
      // Dynamically import the app for testing
      app = require('../app/src/gateway'); // Adjust based on your app entry file
    });

  
    describe('GET /state', function () {
      it('should return the current state', async function () {
        const res = await request(app).get('/state').set('Accept', 'text/plain');
        expect(res.status).to.equal(200);
      });
    });
  
  });