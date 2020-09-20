const auth = require("./auth");
module.exports = function (app) {
    let controller = {};
    const UsersLevel = app.models.usersLevel;
    const Auth = new auth(app);

    /**
     * index
     * @param {Object} req
     * @param {Object} res
     * @method GET
     * @route /userslevel
     */
    controller.getUsersLevel = async (req, res) => {
        try {
            const userValid = await Auth.validaUser(req);
            if (userValid) {
                if (userValid.level !== 3) {
                    return res.status(401).json({
                        "message": "User cannot access this record"
                    });
                }
                let users;
                if (userValid.level == 3) {
                    users = await UsersLevel.findAll();
                } else if (userValid.level == 2) {
                    users = await UsersLevel.findAll({
                        where: {
                            id: userValid.id
                        }
                    });
                } else {
                    users = [];
                }
                return res.status(200).json(users)
            } else {
                return res.status(500).json({ message: 'error: user invalid' })
            }
        } catch (error) {
            console.log(error);
            return res.status(500).json(error)
        }
    }

    /**
* getUser
* @param {Object} req
* @param {Object} res
* @method GET
* @route /userslevel/:id
*/
    controller.getUserLevel = async (req, res) => {
        try {
            const userValid = await Auth.validaUser(req);
            if (userValid) {
                if (userValid.level !== 3) {
                    return res.status(401).json({
                        "message": "User cannot access this record"
                    });
                }
                let user = await UsersLevel.findAll({
                    where: {
                        id: req.params.id
                    }
                });
                return res.status(200).json(user[0])
            } else {
                return res.status(500).json("error: fail get plans")
            }
        } catch (error) {
            console.log(error);
            return res.status(500).json(error)
        }
    }

    return controller;
};