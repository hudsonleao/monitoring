const auth = require("./auth");
module.exports = function (app) {
    let controller = {};
    const Triggers = app.models.triggers;
    const Users = app.models.users;
    const Auth = new auth(app);

    /**
     * getTriggers
     * @param {Object} req
     * @param {Object} res
     * @method GET
     * @route /triggers
     */
    controller.getTriggers = async (req, res) => {
        try {
            const userValid = await Auth.validaUser(req);
            if (userValid) {
                let trigger;
                if (userValid.level == 3) {
                    trigger = await Triggers.findAll();
                } else if (userValid.level == 2) {
                    let allTriggers = [];
                    let users = await Users.findAll({
                        where: {
                            customers_id: userValid.customers_id
                        }
                    });
                    for (let i = 0; i < users.length; i++) {
                        let triggerUser = await Triggers.findAll({
                            where: {
                                users_id: users[i].id
                            }
                        });
                        for (let z = 0; z < triggerUser.length; z++) {
                            allTriggers.push(triggerUser[z]);
                        }
                    }

                    trigger = allTriggers
                } else {
                    trigger = await Triggers.findAll({
                        where: {
                            users_id: userValid.id
                        }
                    });
                }
                return res.status(200).json(trigger)
            } else {
                return res.status(401).json({
                    "message": "User invalid"
                });
            }
        } catch (error) {
            console.log(error);
            return res.status(500).json(error)
        }
    }

    /**
* getTrigger
* @param {Object} req
* @param {Object} res
* @method GET
* @route /triggers/:id
*/
    controller.getTrigger = async (req, res) => {
        try {
            const userValid = await Auth.validaUser(req);
            if (userValid) {
                let trigger
                if (userValid.level === 3) {
                    trigger = await Triggers.findOne({
                        where: {
                            id: req.params.id
                        }
                    });
                } else if (userValid.level === 2) {
                    trigger = await Triggers.findOne({
                        where: {
                            id: req.params.id
                        }
                    });
                    let userTrigger = await Users.findOne({
                        where: {
                            id: trigger.users_id
                        }
                    });
                    if (userTrigger.customers_id !== userValid.customers_id) {
                        return res.status(401).json({
                            message: "User cannot access this record "
                        })
                    }
                } else {
                    trigger = await Triggers.findOne({
                        where: {
                            id: req.params.id,
                            users_id: userValid.id
                        }
                    });
                    if (trigger === null || trigger === undefined || trigger === "") {
                        return res.status(401).json({
                            message: "User cannot access this record "
                        });
                    }
                }
                return res.status(200).json(trigger)
            } else {
                return res.status(500).json("error: fail get telegram")
            }
        } catch (error) {
            console.log(error);
            return res.status(500).json(error)
        }
    }

    /**
     * createTrigger
     * @param {Object} req
     * @param {Object} res
     * @method POST
     * @route /triggers
     */
    controller.createTrigger = async (req, res) => {
        try {
            const userValid = await Auth.validaUser(req);
            let msg;
            if (userValid) {

                let data = req.body;
                let triggerExist = await Triggers.findOne({
                    where: {
                        name: data.name
                    }
                });
                if (triggerExist) {
                    msg = `The trigger are already registered!!! ID: ${triggerExist.dataValues.id}`
                    return res.status(500).json(msg)

                } else {
                    let save = await Triggers.create({
                        users_id: userValid.id,
                        name: data.name,
                        command: data.command
                    });
                    if (save) {
                        let values = []
                        values.push({
                            id: save.id,
                            users_id: userValid.id,
                            name: data.name,
                            command: data.command
                        });
                        return res.status(200).json(values)
                    }
                }
            } else {
                return res.status(401).json({ message: 'error: user invalid' })
            }
        } catch (error) {
            console.log(error);
            return res.status(500).json(error)
        }
    }

    /**
 * updateTrigger
 * @param {Object} req
 * @param {Object} res
 * @method PUT
 * @route /triggers/:id
 */
    controller.updateTrigger = async (req, res) => {
        try {
            const userValid = await Auth.validaUser(req);
            if (userValid) {

                let trigger = await Triggers.findOne({
                    where: {
                        id: req.params.id
                    }
                });

                if (userValid.id !== trigger.users_id) {
                    if (userValid.level === 1) {
                        return res.status(401).json({
                            "message": "User cannot access this record"
                        });
                    } else if (userValid.level === 2) {
                        let userTrigger = await Users.findOne({
                            where: {
                                id: trigger.users_id
                            }
                        });
                        if (userTrigger.customers_id !== userValid.customers_id) {
                            return res.status(401).json({
                                "message": "User cannot access this record"
                            });
                        }
                    }
                }

                let data = req.body;
                let save = await Triggers.update({
                    name: data.name,
                    command: data.command
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
                        command: data.command
                    });
                    return res.status(200).json(values);
                }
            } else {
                return res.status(401).json("user invalid");
            }
        } catch (error) {
            console.log(error);
            return res.status(500).json(error)
        }
    }

    /**
* deleteTrigger
* @param {Object} req
* @param {Object} res
* @method DELETE
* @route /triggers/:id
*/
    controller.deleteTrigger = async (req, res) => {
        try {
            const userValid = await Auth.validaUser(req);
            if (userValid) {
                let trigger = await Triggers.findOne({
                    where: {
                        id: req.params.id
                    }
                });
                if (trigger) {
                    if (userValid.id !== trigger.users_id) {
                        if (userValid.level === 1) {
                            return res.status(401).json({
                                "message": "User cannot access this record"
                            });
                        } else if (userValid.level === 2) {
                            let userTrigger = await Users.findOne({
                                where: {
                                    id: trigger.users_id
                                }
                            });
                            if (userTrigger.customers_id !== userValid.customers_id) {
                                return res.status(401).json({
                                    "message": "User cannot access this record"
                                });
                            }
                        }
                    }
                    let triggerDelete = await Triggers.destroy({
                        where: {
                            id: req.params.id
                        }
                    });
                    if (triggerDelete) {
                        return res.status(200).json(trigger);
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
 * deleteTriggers
 * @param {Object} req
 * @param {Object} res
 * @method DELETE
 * @route /triggers
 */
    controller.deleteTriggers = async (req, res) => {
        try {
            const userValid = await Auth.validaUser(req);
            if (userValid) {
                for (let i = 0; i < ids.length; i++) {
                    let trigger = await Triggers.findOne({
                        where: {
                            id: ids[i]
                        }
                    });
                    if (userValid.id !== trigger.users_id) {
                        if (userValid.level === 1) {
                            return res.status(401).json({
                                "message": "User cannot access this record"
                            });
                        } else if (userValid.level === 2) {
                            let userTrigger = await Users.findOne({
                                where: {
                                    id: trigger.users_id
                                }
                            });
                            if (userTrigger.customers_id !== userValid.customers_id) {
                                return res.status(401).json({
                                    "message": "User cannot access this record"
                                });
                            }
                        }
                    }
                }
                let ids = req.body.id
                for (let i = 0; i < ids.length; i++) {
                    await Triggers.destroy({
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