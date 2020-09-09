const Sequelize = require('sequelize');
module.exports = function() {
    let controller = {};

    /**
     * getConfig
     * @return {Object} config
     */
    const getConfig = () => {
        let config = {
            host: 'localhost',
            database: 'databasename',
            user: 'root',
            pass: '',
            adapter: 'mysql',
            reconnect: true,
            logging: false
        };
        let env = process.env.NODE_ENV || 'development';
        if (env === "development") {
            config.host = '127.0.0.1';
            config.database = "monitoring";
            config.user = "root";
            config.pass = "";
            console.log("Database connected as development...");
        } else if (env === "test") {
            config.host = process.env.NODE_MYSQL_HOST || '127.0.0.1';
            config.database = process.env.NODE_MYSQL_DATABASE ||"monitoring";
            config.user = process.env.NODE_MYSQL_USER ||"monitoring";
            config.pass = process.env.NODE_MYSQL_PASS ||"ap23r2@f34mfDEwvurtq";
            console.log("Database connected as test...");
        } else if (env === "production") {
            config.host = process.env.NODE_MYSQL_HOST || '127.0.0.1';
            config.database = process.env.NODE_MYSQL_DATABASE ||"monitoring";
            config.user = process.env.NODE_MYSQL_USER ||"monitoring";
            config.pass = process.env.NODE_MYSQL_PASS ||"ap23r2@f34mfDEwvurtq";
            config.logging = false;
            console.log("Database connected as production...");
        }
        return config;
    }

    /**
     * getConnection
     * @return {Object} connection
     */
    controller.getConnection = function() {
        let config = getConfig();
        let connection = new Sequelize(config.database, config.user,config.pass, 
        {
            host: config.host,
            dialect: config.adapter,
            reconnect: config.reconnect,
            logging: config.logging
        });
        return connection;
    };

    return controller;
};