document.getElementById('requestButton').addEventListener('click', async function() {
    document.getElementById('responseArea').value = 'Sending request...';

    try {
        console.log('Sending request to /api/');
        const response = await fetch('/api/');
        
        if (!response.ok) {
            throw new Error(`Network response was not ok: ${response.statusText}`);
        }
        console.log('Response received', response);

        const data = await response.text();
        document.getElementById('responseArea').value = data;
    } catch (error) {
        document.getElementById('responseArea').value = `Error: ${error.message}`;
    }
});


document.getElementById('stopButton').addEventListener('click', async function() {
    sequentialShutdown()
});

async function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function sequentialShutdown() {
    await shutDownS2();
    await delay(2000); // Wait 10 seconds

    await shutDownS1();
    await delay(2000); // Wait 10 seconds

    await shutDownSelf();
}

async function shutDownS1()
{
    try {
        console.log('Sending request to /shutdowns1');
        await fetch('/shutdowns1');
    } catch (error) {
        console.error('Error:', error.message);
    }
};

async function shutDownS2()
{
    try {
        console.log('Sending request to /shutdowns2');
        await fetch('/shutdowns2');
    } catch (error) {
        console.error('Error:', error.message);
    }
};

async function shutDownSelf()
{
    try {
        console.log('Sending request to /shutdownsself');
        await fetch('/shutdownself');
    } catch (error) {
        console.error('Error:', error.message);
    }
};