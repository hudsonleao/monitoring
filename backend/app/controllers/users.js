const auth = require("./auth");
const crypto = require("crypto");
module.exports = function (app) {
    let controller = {};
    const Users = app.models.users;
    const Auth = new auth(app);

    /**
     * index
     * @param {Object} req
     * @param {Object} res
     * @method GET
     * @route /users
     */
    controller.getUsers = async (req, res) => {
        const userValid = await Auth.validaUser(req);
        if (userValid) {
            let users;
            if (userValid.level == 3) {
                users = await Users.findAll();
            } else if (userValid.level == 2) {
                users = await Users.findAll({
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
* @route /users/:id
*/
    controller.getUser = async (req, res) => {
        const userValid = await Auth.validaUser(req);
        if (userValid) {
            let plans = await Users.findAll({
                where: {
                    id: req.params.id
                }
            });
            res.status(200).send(plans[0])
        } else {
            res.status(500).json("error: fail get plans")
        }
    }

    /**
     * addUser
     * @param {Object} req
     * @param {Object} res
     * @method POST
     * @route /users
     */
    controller.addUser = async (req, res) => {
        const userValid = await Auth.validaUser(req);
        let msg;
        if (userValid) {

            let data = req.body;
            let password = data.password;
            password = crypto.createHash('md5').update(password).digest("hex");
            let userExist = await Users.findOne({
                where: {
                    user: data.user,
                    password: password
                }
            });
            if (userExist) {
                msg = `The user are already registered!!! ID: ${userExist.dataValues.id}`
                let value = [];
                value.push({
                    customers_id: userValid.customers_id,
                    name: data.name,
                    user: data.user,
                    level: data.level
                })
                return res.status(500).json(msg)

            } else {
                let save = await Users.create({
                    customers_id: userValid.customers_id,
                    name: data.name,
                    user: data.user,
                    password: password,
                    level: data.level
                });
                if (save) {
                    let value = []
                    value.push({
                        customers_id: userValid.customers_id,
                        name: data.name,
                        user: data.user,
                        level: data.level
                    });
                    return res.status(200).json(value)
                }
            }

        } else {
            return res.status(401).send("error: user invalid");
        }
    }

    /**
 * updateUser
 * @param {Object} req
 * @param {Object} res
 * @method PUT
 * @route /users/:id
 */
    controller.updateUser = async (req, res) => {
        const userValid = await Auth.validaUser(req);
        if (userValid) {
            let data = req.body;
            let save = await Users.update({
                name: data.name,
                user: data.user,
                level: data.level
            }, {
                where: {
                    id: data.id
                }
            });
            if (save) {
                let values = []
                values.push({
                    id: data.id,
                    name: data.name,
                    user: data.user,
                    level: data.level
                });
                res.status(200).send(values);
            }
        } else {
            res.status(401).send("error: user invalid");
        }
    }

    /**
* deleteUser
* @param {Object} req
* @param {Object} res
* @method DELETE
* @route /users/:id
*/
    controller.deleteUser = async (req, res) => {
        const userValid = await Auth.validaUser(req);
        if (userValid) {
            let plan = await Users.findOne({
                where: {
                    id: req.params.id
                }
            });
            if (plan) {
                plan = plan.dataValues;
                let appDelete = await Users.destroy({
                    where: {
                        id: req.params.id
                    }
                });
                if (appDelete) {
                    res.status(200).send(plan);
                } else {
                    res.status(500).send("error: it was not possible to delete the data.");
                }

            } else {
                res.status(500).send("error: record does not exist");
            }
        } else {
            res.status(401).send("error: user invalid");
        }
    }

    /**
 * deleteUsers
 * @param {Object} req
 * @param {Object} res
 * @method DELETE
 * @route /users
 */
    controller.deleteUsers = async (req, res) => {
        const userValid = await Auth.validaUser(req);
        if (userValid) {
            let ids = req.body.id
            for (let i = 0; i < ids.length; i++) {
                await Users.destroy({
                    where: {
                        id: ids[i]
                    }
                });
            }
            res.status(200).send(ids);
        } else {
            res.status(401).send("error: user invalid");
        }
    }

    return controller;
};