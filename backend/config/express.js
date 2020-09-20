const express = require("express");
const consign = require("consign");
const sequelize = require("./sequelize")();
const bodyParser = require('body-parser');
const jwt = require('express-jwt');
const jsonwebtoken = require('jsonwebtoken');
const cors = require('cors');


module.exports = function () {
    let app = express();
    const jwtSecret = '@2423rWFq21fdEr3';
    app.debug = process.env.NODE_DEBUG || false;
    app.sequelize = sequelize.getConnection();
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: false }));
    app.use('/', express.static('static'));
    app.use(require('method-override')());
    app.use(cors());
    app.options("*", cors());
    
    app.get('/jwt', (req, res) => {
        if(req.headers.token === '@f3fg4ieWEFwfI3R3@4REFFSFEG$%dfsdf'){
        const token = jsonwebtoken.sign({ user: 'hudson' }, jwtSecret, {
                expiresIn: '24h' // expires in 24 hours
        });
        res.cookie('token', token, { httpOnly: true });
        res.json({ token });
        } else {
            res.status(401).json("token invalid")
        }
    });

    app.use(jwt({ secret: jwtSecret, algorithms: ['HS256'] }));
    
    consign({ cwd: 'app', verbose: false })
        .include("models")
        .then("controllers")
        .then("routes")
        .into(app);
    
        
        

    return app;
};
