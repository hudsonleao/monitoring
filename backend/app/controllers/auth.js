const crypto = require('crypto');
module.exports = function (app) {

    let controller = {};
    const Users = app.models.users;

    controller.validaUser = async (req) => {
        let user = req.headers.user
        let secretReq = req.headers.secret
        let auth = await Users.findOne({
            where: {
                user: user
            }
        });
        if (auth) {
            let secret = crypto.createHash('sha1').update(auth.dataValues.password).digest("hex");
            if (secretReq == secret) {
                return auth.dataValues;
            } else {
                return false;
            }
        } else {
            return false
        }
    }
    return controller;
}