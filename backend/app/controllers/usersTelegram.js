const auth = require("./auth");
module.exports = function (app) {
    let controller = {};
    const UsersTelegram = app.models.usersTelegram;
    const Users = app.models.users;
    const Auth = new auth(app);

    /**
     * getUsersTelegram
     * @param {Object} req
     * @param {Object} res
     * @method GET
     * @route /telegram
     */
    controller.getUsersTelegram = async (req, res) => {
        try {
            const userValid = await Auth.validaUser(req);
            if (userValid) {
                let telegram;
                if (userValid.level == 3) {
                    telegram = await UsersTelegram.findAll();
                } else if (userValid.level == 2) {
                    let allTelegram = [];

                    let users = await Users.findAll({
                        where: {
                            customers_id: userValid.customers_id
                        }
                    });

                    for (let i = 0; i < users.length; i++) {
                        let telegramPerUser = await UsersTelegram.findAll({
                            where: {
                                users_id: users[i].id
                            }
                        });
                        for (let j = 0; j < telegramPerUser.length; j++) {
                            allTelegram.push(telegramPerUser[j]);
                        }
                    }

                    telegram = allTelegram
                } else {
                    telegram = await UsersTelegram.findAll({
                        where: {
                            users_id: userValid.id
                        }
                    });
                }
                return res.status(200).json(telegram)
            } else {
                return res.status(401).json({ message: 'error: user invalid' })
            }
        } catch (error) {
            console.log(error);
            return res.status(500).json(error)
        }
    }

    /**
* getUsersTelegram
* @param {Object} req
* @param {Object} res
* @method GET
* @route /telegram/:id
*/
    controller.getUserTelegram = async (req, res) => {
        try {
            const userValid = await Auth.validaUser(req);
            if (userValid) {
                let telegram
                if (userValid.level === 3) {
                    telegram = await UsersTelegram.findOne({
                        where: {
                            id: req.params.id
                        }
                    });
                } else if (userValid.level === 2) {
                    telegram = await UsersTelegram.findOne({
                        where: {
                            id: req.params.id
                        }
                    });
                    let userTelegram = await Users.findOne({
                        where: {
                            id: telegram.users_id
                        }
                    });
                    if (userTelegram.customers_id !== userValid.customers_id) {
                        return res.status(401).json({
                            message: "User cannot access this record "
                        })
                    }
                } else {
                    telegram = await UsersTelegram.findOne({
                        where: {
                            id: req.params.id,
                            users_id: userValid.users_id
                        }
                    });
                    if (telegram === null || telegram === undefined || telegram === "") {
                        return res.status(401).json({
                            message: "User cannot access this record "
                        });
                    }
                }
                return res.status(200).json(telegram)
            } else {
                return res.status(500).json("error: fail get telegram")
            }
        } catch (error) {
            console.log(error);
            return res.status(500).json(error)
        }
    }

    /**
     * addUsersTelegram
     * @param {Object} req
     * @param {Object} res
     * @method POST
     * @route /telegram
     */
    controller.createUserTelegram = async (req, res) => {
        try {
            const userValid = await Auth.validaUser(req);
            let msg;
            if (userValid) {

                let data = req.body;
                let channelExist = await UsersTelegram.findOne({
                    where: {
                        users_id: userValid.id,
                        telegram_channel_id: data.telegram_channel_id,
                        message_success: data.message_success,
                        message_error: data.message_error
                    }
                });
                if (channelExist) {
                    msg = `The Telegram channel id are already registered!!! ID: ${channelExist.dataValues.id}`
                    return res.status(500).json(msg)

                } else {
                    let save = await UsersTelegram.create({
                        users_id: userValid.id,
                        name: data.name,
                        telegram_channel_id: data.telegram_channel_id,
                        message_success: data.message_success,
                        message_error: data.message_error
                    });
                    if (save) {
                        let values = []
                        values.push({
                            id: save.id,
                            users_id: userValid.id,
                            name: data.name,
                            telegram_channel_id: data.telegram_channel_id,
                            message_success: data.message_success,
                            message_error: data.message_error
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
 * updateUsersTelegram
 * @param {Object} req
 * @param {Object} res
 * @method PUT
 * @route /telegram/:id
 */
    controller.updateUserTelegram = async (req, res) => {
        try {
            const userValid = await Auth.validaUser(req);
            if (userValid) {
                let data = req.body;
                let telegram = await UsersTelegram.findOne({
                    where: {
                        id: req.params.id
                    }
                });
                if (userValid.id !== telegram.users_id) {
                    if (userValid.level === 1) {
                        return res.status(401).json({
                            "message": "User cannot access this record"
                        });
                    } else if (userValid.level === 2) {
                        let userTelegram = await Users.findOne({
                            where: {
                                id: telegram.users_id
                            }
                        });
                        if (userTelegram.customers_id !== userValid.customers_id) {
                            return res.status(401).json({
                                "message": "User cannot access this record"
                            });
                        }
                    }
                }
                let save = await UsersTelegram.update({
                    name: data.name,
                    telegram_channel_id: data.telegram_channel_id,
                    message_success: data.message_success,
                    message_error: data.message_error
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
                        telegram_channel_id: data.telegram_channel_id,
                        message_success: data.message_success,
                        message_error: data.message_error
                    });
                    return res.status(200).json(values);
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
* deleteUserTelegram
* @param {Object} req
* @param {Object} res
* @method DELETE
* @route /telegram/:id
*/
    controller.deleteUserTelegram = async (req, res) => {
        try {
            const userValid = await Auth.validaUser(req);
            if (userValid) {
                let telegram = await UsersTelegram.findOne({
                    where: {
                        id: req.params.id
                    }
                });
                if (telegram) {
                    if (userValid.id !== telegram.users_id) {
                        if (userValid.level === 1) {
                            return res.status(401).json({
                                "message": "User cannot access this record"
                            });
                        } else if (userValid.level === 2) {
                            let userTelegram = await Users.findOne({
                                where: {
                                    id: telegram.users_id
                                }
                            });
                            if (userTelegram.customers_id !== userValid.customers_id) {
                                return res.status(401).json({
                                    "message": "User cannot access this record"
                                });
                            }
                        }
                    }
                    let telegramDelete = await UsersTelegram.destroy({
                        where: {
                            id: req.params.id
                        }
                    });
                    if (telegramDelete) {
                        return res.status(200).json(telegram);
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
 * deleteUsersTelegram
 * @param {Object} req
 * @param {Object} res
 * @method DELETE
 * @route /telegram
 */
    controller.deleteUsersTelegram = async (req, res) => {
        try {
            const userValid = await Auth.validaUser(req);
            if (userValid) {
                let ids = req.body.id
                for (let i = 0; i < ids.length; i++) {
                    let telegram = await UsersTelegram.findOne({
                        where: {
                            id: ids[i]
                        }
                    });
                    if (userValid.id !== telegram.users_id) {
                        if (userValid.level === 1) {
                            return res.status(401).json({
                                "message": "User cannot access this record"
                            });
                        } else if (userValid.level === 2) {
                            let userTelegram = await Users.findOne({
                                where: {
                                    id: telegram.users_id
                                }
                            });
                            if (userTelegram.customers_id !== userValid.customers_id) {
                                return res.status(401).json({
                                    "message": "User cannot access this record"
                                });
                            }
                        }
                    }
                    await UsersTelegram.destroy({
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