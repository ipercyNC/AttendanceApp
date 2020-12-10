const app = require('./app');
const https = require('https');
const fs = require('fs');
const config = require('./utils/config.js');
const logger = require('./utils/logger');

const options = {
	key: fs.readFileSync('client-key.pem'),
	cert: fs.readFileSync('client-cert.pem')
};
const server = https.createServer(options, app);

server.listen(config.PORT, () => {
	logger.info(`Server running on port ${config.PORT}`);
});
