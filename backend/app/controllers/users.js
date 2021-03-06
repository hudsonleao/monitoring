const auth = require("./auth");
const crypto = require("crypto");
module.exports = function (app) {
    let controller = {};
    const Users = app.models.users;
    const Customers = app.models.customers;
    const Plans = app.models.plans;
    const Auth = new auth(app);

    /**
     * index
     * @param {Object} req
     * @param {Object} res
     * @method GET
     * @route /users
     */
    controller.getUsers = async (req, res) => {
        try {
            const userValid = await Auth.validaUser(req);
            if (userValid) {
                let users;
                if (userValid.level == 3) {
                    users = await Users.findAll();
                } else if (userValid.level == 2) {
                    users = await Users.findAll({
                        where: {
                            customers_id: userValid.customers_id
                        }
                    });
                } else {
                    users = [];
                }
                return res.status(200).json(users)
            } else {
                return res.status(500).json({ message: 'user invalid' })
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
* @route /users/:id
*/
    controller.getUser = async (req, res) => {
        try {
            const userValid = await Auth.validaUser(req);
            if (userValid) {
                let user;
                if (userValid.level === 3) {
                    user = await Users.findOne({
                        where: {
                            id: req.params.id
                        }
                    });
                } else if (userValid.level === 2) {
                    user = await Users.findOne({
                        where: {
                            id: req.params.id
                        }
                    });
                    if (user) {
                        if (user.customers_id) {
                            if (user.customers_id !== userValid.customers_id) {
                                return res.status(401).json({
                                    message: "User cannot access this record "
                                });
                            }
                        }
                    }
                } else {
                    user = [];
                }
                return res.status(200).json(user)
            } else {
                return res.status(500).json("error: fail get plans")
            }
        } catch (error) {
            console.log(error);
            return res.status(500).json(error)
        }
    }

    /**
     * createUser
     * @param {Object} req
     * @param {Object} res
     * @method POST
     * @route /users
     */
    controller.createUser = async (req, res) => {
        try {
            const userValid = await Auth.validaUser(req);
            let msg;
            if (userValid) {

                if (userValid.level === 1) {
                    return res.status(401).json({
                        "message": "Operation not allowed"
                    });
                }
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
                    if (userValid.level !== 3) {

                        let customer = await Customers.findOne({
                            where: {
                                id: userValid.customers_id
                            }
                        });

                        let plan = await Plans.findOne({
                            where: {
                                id: customer.plans_id
                            }
                        })

                        let users = await Users.findAll({
                            where: {
                                customers_id: userValid.customers_id 
                            }
                        });

                        if(users.length >= plan.users_limit){
                            return res.status(401).json({
                                "message": "User limit reached"
                            });
                        }
                    }
                    let save = await Users.create({
                        customers_id: userValid.customers_id,
                        name: data.name,
                        user: data.user,
                        password: password,
                        level: data.level,
                        created_date: new Date()
                    });
                    if (save) {
                        let value = []
                        value.push({
                            customers_id: userValid.customers_id,
                            name: data.name,
                            user: data.user,
                            level: data.level,
                            created_date: new Date()
                        });
                        return res.status(200).json(value)
                    }
                }

            } else {
                return res.status(401).json("error: user invalid");
            }
        } catch (error) {
            console.log(error);
            return res.status(500).json(error)
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
        try {
            const userValid = await Auth.validaUser(req);
            if (userValid) {
                let user = await Users.findOne({
                    where: {
                        id: req.params.id
                    }
                });
                if (userValid.id !== user.id) {
                    if (userValid.level === 1) {
                        return res.status(401).json({
                            "message": "User cannot access this record"
                        });
                    } else if (userValid.level === 2) {
                        let User = await Users.findOne({
                            where: {
                                id: user.id
                            }
                        });
                        if (User.customers_id !== userValid.customers_id) {
                            return res.status(401).json({
                                "message": "User cannot access this record"
                            });
                        }
                    }
                }
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
                    res.status(200).json(values);
                }
            } else {
                res.status(401).json("error: user invalid");
            }
        } catch (error) {
            console.log(error);
            return res.status(500).json(error)
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
        try {
            const userValid = await Auth.validaUser(req);
            if (userValid) {
                let user = await Users.findOne({
                    where: {
                        id: req.params.id
                    }
                });
                if (user) {
                    let user = await Users.findOne({
                        where: {
                            id: req.params.id
                        }
                    });
                    if (userValid.id !== user.id) {
                        if (userValid.level === 1) {
                            return res.status(401).json({
                                "message": "User cannot access this record"
                            });
                        } else if (userValid.level === 2) {
                            let User = await Users.findOne({
                                where: {
                                    id: user.id
                                }
                            });
                            if (User.customers_id !== userValid.customers_id) {
                                return res.status(401).json({
                                    "message": "User cannot access this record"
                                });
                            }
                        }
                    }
                    let appDelete = await Users.destroy({
                        where: {
                            id: req.params.id
                        }
                    });
                    if (appDelete) {
                        return res.status(200).json(user);
                    } else {
                        return res.status(500).json("error: it was not possible to delete the data.");
                    }

                } else {
                    return res.status(500).json("error: record does not exist");
                }
            } else {
                return res.status(401).json("error: user invalid");
            }
        } catch (error) {
            console.log(error);
            return res.status(500).json(error)
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
        try {
            const userValid = await Auth.validaUser(req);
            if (userValid) {
                let ids = req.body.id
                for (let i = 0; i < ids.length; i++) {
                    let user = await Users.findOne({
                        where: {
                            id: ids[i]
                        }
                    });
                    if (userValid.id !== user.id) {
                        if (userValid.level === 1) {
                            return res.status(401).json({
                                "message": "User cannot access this record"
                            });
                        } else if (userValid.level === 2) {
                            if (user.customers_id !== userValid.customers_id) {
                                return res.status(401).json({
                                    "message": "User cannot access this record"
                                });
                            }
                        }
                    }
                    await Users.destroy({
                        where: {
                            id: ids[i]
                        }
                    });
                }
                return res.status(200).json(ids);
            } else {
                return res.status(401).json("error: user invalid");
            }
        } catch (error) {
            console.log(error);
            return res.status(500).json(error)
        }
    }

    return controller;
};