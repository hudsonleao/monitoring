const auth = require('./auth');
const Sequelize = require('sequelize');
module.exports = function (app) {
    let controller = {};
    const Auth = new auth(app);
    

    const filterUsers = async (initialDate, finalDate) => {
        try {
            const query = `SELECT *
            FROM users
            WHERE created_date 
            BETWEEN '${initialDate}' 
            AND '${finalDate}'`
            const list = await app.sequelize.query(query, { type: Sequelize.QueryTypes.SELECT });
            if (list.length > 0) {
                return list.length
            } else {
                return 0
            }

        } catch (error) {
            console.log(`Error getList: ${error}`);
            return 0
        }
    }

    /**
     * getUsers
     * @param {Object} req
     * @param {Object} res
     * @method GET
     * @route /chart/users
     */
    controller.getUsers = async (req, res) => {
        try {
            const userValid = await Auth.validaUser(req);
            if (userValid) {
                if (userValid.level !== 3) {
                    return res.status(401).json({
                        "message": "User cannot access this record"
                    });
                }
                let now = new Date();
                let timestamp = now.getTime();
                let count = 1;
                let numberOfUsers = [];
                let dates = [];
                while (count < 10) {
                    let finalDate = new Date(timestamp).toISOString();
                    timestamp = timestamp - 86400000
                    let initialDate = new Date(timestamp).toISOString();
                    let users = await filterUsers(initialDate, finalDate)
                    let day = new Date(finalDate).getDate();
                    if(day < 10){
                        day = `0${day}`
                    }
                    let month = parseInt(new Date(finalDate).getMonth()) + 1;
                    if(month < 10){
                        month = `0${month}`
                    }
                    if(users > 0){
                        numberOfUsers.push(users);
                        dates.push(`${day}/${month}`)
                    }
                    count++
                }
                return res.status(200).json({"users": numberOfUsers.reverse(), "dates": dates.reverse()})
            }   
        } catch (error) {
            console.log(error);
            return res.status(500).json(error)
        }
    }
    return controller;
}