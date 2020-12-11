const app = require('./app');
const https = require('https');
const http = require('http');
const fs = require('fs');
const config = require('./utils/config.js');
const logger = require('./utils/logger');
/*
let server = null;
if (process.env.NODE_ENV !== 'production'){
	const options = {
		key: fs.readFileSync('client-key.pem'),
		cert: fs.readFileSync('client-cert.pem')
	};
	server = https.createServer(options, app);
}else
	server = http.createServer(app);
*/

const server = http.createServer(app);

server.listen(config.PORT, () => {
	logger.info(`Server running on port ${config.PORT}`);
});
