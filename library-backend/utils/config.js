require('dotenv').config();

const DB_USER_NAME = process.env.DB_USER_NAME;
const DB_USER_PASSWORD = process.env.DB_USER_PASSWORD;
const DB_CLUSTER_ADDRESS = process.env.DB_CLUSTER_ADDRESS;
const DB_NAME = process.env.DB_NAME;
const JWT_SECRET = process.env.JWT_SECRET;

module.exports = {
    DB_USER_NAME,
    DB_USER_PASSWORD,
    DB_CLUSTER_ADDRESS,
    DB_NAME,
    JWT_SECRET,
};
