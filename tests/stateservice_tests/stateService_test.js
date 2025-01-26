const chai = require("chai");
const expect = chai.expect;
const Redis = require("ioredis");
const StateService = require("./stateService");

class MockRedis {
    constructor() {
      this.store = new Map();
    }
    async get(key) {
      return this.store.get(key) || null;
    }
    async set(key, value) {
      this.store.set(key, value);
    }
    async del(key) {
      this.store.delete(key);
    }
  }

describe('StateService tests', function () {

    let redisMock;
    let stateService;

    beforeEach(() => {
        redisMock = new MockRedis();
        stateService = new StateService(redisMock); // Pass mock Redis instance
      });
    
    describe('logging in', function () {
        it("should logged in state", async () => {
            await stateService.setLoginState("loggedIn");
            const state = await redisMock.get("login:state");
            expect(state).to.equal("loggedIn");
        });
    });

        describe('system state', function () {
            it("should system state", async () => {
                await stateService.setSystemState("INIT");
                const state = await stateService.getSystemState();
                expect(res.status).to.equal(200);
            });


        });


});