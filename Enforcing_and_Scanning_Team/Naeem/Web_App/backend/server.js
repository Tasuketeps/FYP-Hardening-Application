// Name: Mohammad Naeem bin Mohammad Rafi
// Admission number: P2205625
// Class: DISM/FT/2A/04
const app = require('./controller/app');
const fs = require('fs');
const https = require('https');
const path = require('path');
const bodyParser = require('body-parser');

const port = 3000;

const options = {
    key: fs.readFileSync(path.join(__dirname, '/cert/key.pem')),
    cert: fs.readFileSync(path.join(__dirname, '/cert/cert.pem'))
};

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const httpsServer = https.createServer(options, app);

// Listen for errors on the server
httpsServer.on('error', (err) => {
    console.error('Server error:', err);
    process.exit(1); // Exit with a failure code
});

// Log when the server starts listening
httpsServer.listen(port, () => {
    console.log(`HTTPS server listening on port ${port}`);
});

// Catch unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
    process.exit(1); // Exit with a failure code
});

// Catch uncaught exceptions
process.on('uncaughtException', (err) => {
    console.error('Uncaught Exception:', err);
    process.exit(1); // Exit with a failure code
});

