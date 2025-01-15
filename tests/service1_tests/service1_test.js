const chai = require('chai');
const expect = chai.expect;

const controller = require('../app/src/controller'); // Import the entire module
const { getIpAddress, getSystemInfo } = controller; // Destructure correctly from the imported module

describe('Service1 Tests', () => {
    it('getIpAddress returns a valid IP address or error message', () => {
        const ip = getIpAddress();
        expect(ip).to.be.a('string');
    });

    // it('getSystemInfo retrieves system information', async () => {
    //     const info = await getSystemInfo();
    //     expect(info).to.have.property('ipAddress');
    //     expect(info).to.have.property('uptime');
    // });
});
