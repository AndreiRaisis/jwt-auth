const mysql = require("mysql");

const dbConfig = {
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DB_NAME,
    port: process.env.MYSQL_PORT,
    connectionLimit: process.env.MYSQL_CONNECTION_LIMIT
};

const pool = mysql.createPool(dbConfig);

const connection = () => {
    return new Promise((resolve, reject) => {

        pool.getConnection((err, connection) => {
            if (err) reject(err);

            const query = (sql, binding) => {
                return new Promise((resolve, reject) => {
                    connection.query(sql, binding, (err, result) => {
                        if (err) reject(err);
                        resolve(result);
                    });
                });
            };

            const release = () => {
                return new Promise((resolve, reject) => {
                    if (err) reject(err);
                    resolve(connection.release());
                });
            };

            resolve({ query, release });
        });

    });
};

const query = (sql, binding) => {
    return new Promise((resolve, reject) => {
        pool.query(sql, binding, (err, result, fields) => {
            if (err) reject(err);
            resolve(result);
        });
    });
};

module.exports = { pool, connection, query };
