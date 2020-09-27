const randomstring = require("randomstring");

module.exports = function (app) {
    let controller = {};
    const ForgotPassword = app.models.forgotPassword;

    /**
     * forgotPassword
     * @param {Object} req
     * @param {Object} res
     * @method POST
     * @route /forgot-password
     */
    controller.forgotPassword = async (req, res) => {
        try {
            let { resetEmail } = req.body;

            if (resetEmail) {

                let exist = await ForgotPassword.findOne({
                    where: {
                        email: resetEmail
                    }
                });

                if (exist) {
                    return res.status(500).json({ "message": "The password change request has already been made, check your email or wait." })
                }

                let hash = `${randomstring.generate()}${randomstring.generate()}${randomstring.generate()}`

                await ForgotPassword.create({
                    email: resetEmail,
                    hash: hash,
                    created_date: new Date()
                });

                return res.status(200).json({ "message": "The password recovery request has been saved. You will soon receive an email." })
            }
        } catch (error) {
            console.log(error);
            return res.status(500).json(error)
        }
    }

    return controller;
};