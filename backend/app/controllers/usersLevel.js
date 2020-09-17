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
        const userValid = await Auth.validaUser(req);
        if (userValid) {
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
            res.status(200).send(users)
        } else {
            res.status(500).json({ message: 'error: user invalid' })
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
        const userValid = await Auth.validaUser(req);
        if (userValid) {
            let user = await UsersLevel.findAll({
                where: {
                    id: req.params.id
                }
            });
            res.status(200).send(user[0])
        } else {
            res.status(500).json("error: fail get plans")
        }
    }

    return controller;
};