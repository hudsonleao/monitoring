const fetch = require('node-fetch');
const crypto = require('crypto');
module.exports = function (app) {
    let controller = {};
    const Users = app.models.users;

    /**
     * loginGoogle
     * @param {Object} req
     * @param {Object} res
     * @method GET
     * @route /login/google
     */
    controller.loginGoogle = async (req, res) => {
        try {
            let { token_google, username } = req.headers;
            let url = "https://www.googleapis.com/oauth2/v3/tokeninfo?id_token="

            let response = await fetch(`${url}${token_google}`);
            if (response.status !== 200) {
                return res.status(500).json("Error consulting token Google")
            }
            response = await response.json();

            if (response.email != username) {
                return res.status(500).json("Error, token incorrect")
            }

            let user = await Users.findOne({
                where: {
                    user: username
                }
            });
            if (!user) {
                return res.status(500).json("Error, user incorrect")
            } 
            
            let secret = crypto.createHash('sha1').update(user.password).digest("hex");

            let permission;

            if(user.level == 3){
                permission = "super_admin"
            } else if(user.level == 2){
                permission = "admin"
            } else {
                permission = "normal"
            }

            return res.status(200).json({"secret": secret, "permission": permission})
        } catch (error) {
            console.log(error);
            return res.status(500).json(error)
        }
    }

    return controller;
};