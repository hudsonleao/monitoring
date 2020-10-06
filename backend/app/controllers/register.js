const crypto = require('crypto');
module.exports = function (app) {
    let controller = {};
    const Users = app.models.users;
    const Customers = app.models.customers

    /**
     * register
     * @param {Object} req
     * @param {Object} res
     * @method POST
     * @route /register
     */
    controller.register = async (req, res) => {
        try {
            let { name, username, password } = req.body;

            password = crypto.createHash('md5').update(password).digest("hex");

            let userExist = await Users.findOne({
                where: {
                    user: username,
                    password: password
                }
            });
            if (userExist) {
                let msg = `The user are already registered!`
                return res.status(500).json({ "message": msg })
            } else {
                const customer = await Customers.create({
                    plans_id: 1,
                    name: name,
                    email: username
                });
                if (customer) {
                    await Users.create({
                        customers_id: customer.id,
                        name: name,
                        user: username,
                        password: password,
                        level: 2,
                        created_date: new Date()
                    })

                } else {
                    return res.status(500).json({ "message": "Error create customer" })
                }
            }

            return res.status(200).json({ "message": "User created"})
        } catch (error) {
            console.log(error);
            return res.status(500).json(error)
        }
    }
    return controller;
};