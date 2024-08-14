let startTime, interval;

// Start the timer when the "Start Timer" button is clicked
document.getElementById('start').addEventListener('click', () => {
    startTime = Date.now();
    interval = setInterval(updateTimer, 1000);
});

// Stop the timer and upload the elapsed time to IPFS when the "Stop Timer" button is clicked
document.getElementById('stop').addEventListener('click', async () => {
    clearInterval(interval);
    const elapsedTime = Date.now() - startTime;
    document.getElementById('timerDisplay').innerText = 'Uploading...';
    await uploadToIPFS(elapsedTime.toString());
    document.getElementById('timerDisplay').innerText = new Date(elapsedTime).toISOString().substr(11, 8);
});

// Update the timer display every second
function updateTimer() {
    const elapsedTime = Date.now() - startTime;
    document.getElementById('timerDisplay').innerText = new Date(elapsedTime).toISOString().substr(11, 8);
}

// Upload the elapsed time to IPFS
async function uploadToIPFS(data) {
    try {
        const ipfs = IPFS.create({ host: 'ipfs.infura.io', port: 5001, protocol: 'https' });
        const result = await ipfs.add(data);
        console.log('IPFS Hash:', result.path);

        // Optionally, store the IPFS hash on Ethereum
        await storeHashOnEthereum(result.path);
    } catch (error) {
        console.error('IPFS upload failed:', error);
    }
}

// Optional: Store the IPFS hash on Ethereum
async function storeHashOnEthereum(ipfsHash) {
    try {
        const provider = new ethers.providers.InfuraProvider('mainnet', 'YOUR_INFURA_PROJECT_ID');
        const signer = provider.getSigner();
        const contract = new ethers.Contract('YOUR_CONTRACT_ADDRESS', [
            // ABI of your contract here
        ], signer);

        const tx = await contract.storeHash(ipfsHash);
        console.log('Transaction hash:', tx.hash);
    } catch (error) {
        console.error('Ethereum transaction failed:', error);
    }
}
