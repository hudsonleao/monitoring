const crypto = require('crypto');

module.exports = function (app) {
    let controller = {};
    const Users = app.models.users;

    /**
     * login
     * @param {Object} req
     * @param {Object} res
     * @method POST
     * @route /login
     */
    controller.login = async (req, res) => {
        try {
            let user;
            let password;
            if (req.body.user && req.body.password) {
                user = req.body.user;
                password = req.body.password;
            } else {
                return res.status(500).json({ message: 'user or password empty' });
            }
            password = crypto.createHash('md5').update(password).digest("hex");
            let secret = crypto.createHash('sha1').update(password).digest("hex");

            const userExist = await Users.findOne({
                where: {
                    user: user,
                    password: password
                }
            });
            if (userExist) {
                let permission;
                if (userExist.level == 3) {
                    permission = "super_admin"
                } else if (userExist.level == 2) {
                    permission = "admin"
                } else {
                    permission = "normal"
                }
                return res.status(200).json({ message: 'exist', secret: secret, permission: permission });
            } else {
                return res.status(500).json({ message: 'Username or password incorrect!' });
            }
        } catch (error) {
            console.log(error);
            return res.status(500).json(error)
        }
    }

    return controller;
};