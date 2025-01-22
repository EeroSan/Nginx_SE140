const os = require('os');
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

const getIpAddress = () => {
    const interfaces = os.networkInterfaces();
    for (const name of Object.keys(interfaces)) {
        for (const iface of interfaces[name]) {
            if (iface.family === 'IPv4' && !iface.internal) {
                return iface.address;
            }
        }
    }
    return 'IP address not found';
};

const getRunningProcesses = () => {
    return new Promise((resolve, reject) => {
        const procDir = '/proc';
        let processes = [];

        // Read the contents of the /proc directory
        fs.readdir(procDir, (err, files) => {
            if (err) {
                resolve('No process found');
                return;
            }

            // Filter numeric directories (these correspond to process IDs)
            const pidDirs = files.filter((file) => /^\d+$/.test(file));

            // For each process, read the cmdline file for process information
            pidDirs.forEach((pid) => {
                const cmdPath = path.join(procDir, pid, 'cmdline');
                try {
                    const cmdline = fs.readFileSync(cmdPath, 'utf-8');
                    if (cmdline) {
                        processes.push(`PID: ${pid}, Command: ${cmdline.replace(/\0/g, ' ')}`);
                    }
                } catch (err) {
                    // Skip if we can't read the file
                }
            });

            if (processes.length === 0) {
                resolve('No process found');
            } else {
                resolve(processes.join('\n'));
            }
        });
    });
};

const getDiskSpace = () => {
    return new Promise((resolve, reject) => {
        exec('df -h', (error, stdout, stderr) => {
            if (error) {
                reject(`Error: ${error.message}`);
                return;
            }
            if (stderr) {
                reject(`Stderr: ${stderr}`);
                return;
            }
            resolve(stdout);
        });
    });
};

const getUptime = () => {
    const uptimeSeconds = os.uptime();
    const days = Math.floor(uptimeSeconds / (24 * 3600));
    const hours = Math.floor((uptimeSeconds % (24 * 3600)) / 3600);
    const minutes = Math.floor((uptimeSeconds % 3600) / 60);
    const seconds = Math.floor(uptimeSeconds % 60);

    return `${days}d ${hours}h ${minutes}m ${seconds}s`;
};

const getSystemInfo = async () => {
    try {
        const ipAddress = getIpAddress();
        const uptime = getUptime();
        const diskSpace = await getDiskSpace();
        const runningProcesses = await getRunningProcesses();
        
        return {
            message: 'Service1 is running',
            ipAddress,
            uptime,
            diskSpace,
            runningProcesses
        };
    } catch (error) {
        console.error('Error:', error.message);
        return {
            message: 'Error retrieving system information',
            error: error.message
        };
    }
};

const getService2Response = async () => {
    try {
        const response = await fetch('http://service2:5000');
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error:', error.message);
        return {
            message: 'Error retrieving response from Service2',
            error: error.message
        };
    }
};

exports.getResponse = async (req, res) => {

    // res.status(200).send('Service1 is running');
    const sysInfo = await getSystemInfo();
    const sys2Info = await getService2Response();
    res.status(200).json({
        // message: "Service1 is running",
        service: {
            ipAddress: sysInfo.ipAddress,
            uptime: sysInfo.uptime,
            diskSpace: sysInfo.diskSpace,
            runningProcesses: sysInfo.runningProcesses
        },
        service2: sys2Info

    });
    
};

exports.sleepFor = (seconds) => {
    console.log(`Sleeping for ${seconds} seconds`);
    const end = Date.now() + seconds * 1000;
    while (Date.now() < end) {
        // Busy-wait loop to simulate sleep
    }
    console.log(`Waking up, sleep is over`);
}

exports.shutdown = (req, res) => {
    console.log('Attempting to shut down system');
    process.exit(0);
};

