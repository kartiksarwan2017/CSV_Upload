const fs = require('fs');
const rfs = require('rotating-file-stream');
const path = require('path');
require('dotenv').config();

const logDirectory = path.join(__dirname, '../production_logs');
fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory);

const accessLogStream = rfs.createStream('access.log', {
    interval: '1d', // rotate daily
    path: logDirectory
});

const development = {
    name: "development",
    MongoDB_URL: process.env.CSV_UPLOAD_MONGODB_URL, 
    asset_path: process.env.CSV_UPLOAD_ASSET_PATH,
    session_cookie_key: process.env.CSV_UPLOAD_SESSION_COOKIE_KEY,
    morgan: {
        mode: 'dev',
        options: {stream: accessLogStream}
    }
}


const production = {
    name: "production",
    MongoDB_URL: process.env.CSV_UPLOAD_MONGODB_URL, 
    asset_path: process.env.CSV_PRODUCTION_UPLOAD_ASSET_PATH,
    session_cookie_key: process.env.CSV_UPLOAD_SESSION_COOKIE_KEY,
    morgan: {
        mode: 'combined',
        options: {stream: accessLogStream}
    }
}


module.exports = eval(process.env.CSV_UPLOAD_ENVIRONMENT) == undefined ? development : eval(process.env.CSV_UPLOAD_ENVIRONMENT);