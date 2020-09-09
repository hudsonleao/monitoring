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

        const userExist = await Users.findAll({
            where: {
                user: user,
                password: password
            }
        });

        if (userExist[0]) {
            res.status(200).json({ message: 'exist', secret: secret });
        } else {
            res.status(500).json({ message: 'incorrect' });
        }
    }

    return controller;
};