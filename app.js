let startTime, interval;

document.getElementById('start').addEventListener('click', () => {
    startTime = Date.now();
    interval = setInterval(updateTimer, 1000);
});

document.getElementById('stop').addEventListener('click', () => {
    clearInterval(interval);
    const elapsedTime = Date.now() - startTime;
    uploadToIPFS(elapsedTime.toString());
});

function updateTimer() {
    const elapsedTime = Date.now() - startTime;
    document.getElementById('timerDisplay').innerText = new Date(elapsedTime).toISOString().substr(11, 8);
}

async function uploadToIPFS(data) {
    const ipfs = IPFS.create({ host: 'ipfs.infura.io', port: 5001, protocol: 'https' });
    const result = await ipfs.add(data);
    console.log('IPFS Hash:', result.path);
    // Optionally store the hash on Ethereum
}
