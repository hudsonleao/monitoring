const auth = require('./auth');

module.exports = function (app) {
    let controller = {};
    const Applications = app.models.aplications;
    const Users = app.models.users;
    const Telegram = app.models.usersTelegram;
    const Triggers = app.models.triggers;
    const Auth = new auth(app);

    /**
     * index
     * @param {Object} req
     * @param {Object} res
     * @method GET
     * @route /applications
     */
    controller.getApplications = async (req, res) => {
        try {
            const userValid = await Auth.validaUser(req);
            if (userValid) {
                let applications;
                if (userValid.level === 3) {
                    applications = await Applications.findAll();
                    for (let i = 0; i < applications.length; i++) {
                        let telegram = await Telegram.findOne({
                            attributes: ['name'],
                            where: {
                                id: applications[i].users_telegram_id
                            }
                        });
                        let trigger = await Triggers.findOne({
                            attributes: ['name'],
                            where: {
                                id: applications[i].triggers_id
                            }
                        });
                        applications[i].triggers_id = trigger.name
                        applications[i].users_telegram_id = telegram.name;
                    }
                } else if (userValid.level === 2) {
                    let allApplications = [];

                    let users = await Users.findAll({
                        where: {
                            customers_id: userValid.customers_id
                        }
                    });

                    for (let i = 0; i < users.length; i++) {
                        let applicationsPerUser = await Applications.findAll({
                            where: {
                                users_id: users[i].id
                            }
                        });
                        for (let j = 0; j < applicationsPerUser.length; j++) {
                            allApplications.push(applicationsPerUser[j]);
                        }
                    }
                    for (let i = 0; i < allApplications.length; i++) {
                        let telegram = await Telegram.findOne({
                            attributes: ['name'],
                            where: {
                                id: allApplications[i].users_telegram_id
                            }
                        });
                        let trigger = await Triggers.findOne({
                            attributes: ['name'],
                            where: {
                                id: allApplications[i].triggers_id
                            }
                        });

                        if (trigger) {
                            allApplications[i].triggers_id = trigger.name
                        }
                        if (telegram) {
                            allApplications[i].users_telegram_id = telegram.name;
                        }
                    }
                    applications = allApplications
                } else {
                    applications = await Applications.findAll({
                        where: {
                            users_id: userValid.id
                        }
                    });

                    for (let i = 0; i < applications.length; i++) {
                        let telegram = await Telegram.findOne({
                            attributes: ['name'],
                            where: {
                                id: applications[i].users_telegram_id
                            }
                        });
                        let trigger = await Triggers.findOne({
                            attributes: ['name'],
                            where: {
                                id: applications[i].triggers_id
                            }
                        });
                        applications[i].triggers_id = trigger.name
                        applications[i].users_telegram_id = telegram.name;
                    }
                }
                return res.status(200).json(applications)
            } else {
                return res.status(500).json("error: fail get applications")
            }
        } catch (error) {
            console.log(error);
            return res.status(500).json(error)
        }
    }

    /**
 * index
 * @param {Object} req
 * @param {Object} res
 * @method GET
 * @route /applications/:id
 */
    controller.getApplication = async (req, res) => {
        try {
            const userValid = await Auth.validaUser(req);
            if (userValid) {
                let applications
                if (userValid.level === 3) {
                    applications = await Applications.findOne({
                        where: {
                            id: req.params.id
                        }
                    });
                } else if (userValid.level === 2) {
                    applications = await Applications.findOne({
                        where: {
                            id: req.params.id
                        }
                    });
                    let userApplication = await Users.findOne({
                        where: {
                            id: applications.users_id
                        }
                    });
                    if (userApplication.customers_id !== userValid.customers_id) {
                        return res.status(401).json({
                            message: "User cannot access this record "
                        })
                    }
                } else {
                    applications = await Applications.findOne({
                        where: {
                            id: req.params.id,
                            users_id: userValid.users_id
                        }
                    });
                    if (applications === null || applications === undefined || applications === "") {
                        return res.status(401).json({
                            message: "User cannot access this record "
                        });
                    }
                }
                return res.status(200).json(applications)
            } else {
                return res.status(500).json("error: fail get applications")
            }
        } catch (error) {
            console.log(error);
            return res.status(500).json(error)
        }
    }

    /**
     * createApplication
     * @param {Object} req
     * @param {Object} res
     * @method POST
     * @route /applications
     */
    controller.createApplication = async (req, res) => {
        try {
            const userValid = await Auth.validaUser(req);
            let msg = "";
            let url;
            let ip;
            let data = req.body
            if (userValid) {

                if (data.url) {
                    url = data.url.replace("https://", "").replace("http://", "");
                }
                if (data.ip) {
                    ip = data.ip.replace("https://", "").replace("http://", "");
                }
                let urlExist;
                let ipExist;
                if (url) {
                    urlExist = await Applications.findOne({
                        where: {
                            users_id: userValid.id,
                            users_telegram_id: data.users_telegram_id ? data.users_telegram_id : null,
                            triggers_id: data.triggers_id ? data.triggers_id : null,
                            url: url,
                            port: data.port ? data.port : null,
                            protocol: data.protocol
                        }
                    });
                }
                if (ip) {
                    ipExist = await Applications.findOne({
                        where: {
                            users_id: userValid.id,
                            users_telegram_id: data.users_telegram_id ? data.users_telegram_id : null,
                            triggers_id: data.triggers_id ? data.triggers_id : null,
                            ip: ip,
                            port: data.port ? data.port : null,
                            protocol: data.protocol
                        }
                    });
                }
                if (urlExist) {
                    msg = `The url and port are already registered!!! ID: ${urlExist.id}`
                    return res.status(406).json({
                        "message": msg
                    });

                } else if (ipExist) {
                    msg = `The ip and port are already registered!!! ID: ${ipExist.id}`
                    return res.status(406).json({
                        "message": msg
                    });
                } else {
                    let save = await Applications.create({
                        users_id: userValid.id,
                        name: data.name,
                        users_telegram_id: data.users_telegram_id,
                        triggers_id: data.triggers_id,
                        protocol: data.protocol,
                        url: url,
                        ip: ip,
                        port: data.port
                    });
                    if (save) {
                        let values = []
                        values.push({
                            id: save.dataValues.id,
                            name: data.name,
                            users_telegram_id: data.users_telegram_id,
                            triggers_id: data.triggers_id,
                            protocol: data.protocol,
                            url: url,
                            ip: ip,
                            port: data.port
                        });
                        return res.status(200).json(values);
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
     * updateApplication
     * @param {Object} req
     * @param {Object} res
     * @method PUT
     * @route /applications/:id
     */
    controller.updateApplication = async (req, res) => {
        try {
            const userValid = await Auth.validaUser(req);
            let msg;
            if (userValid) {
                let data = req.body;
                if (data.url) {
                    data.url = data.url.replace("https://", "").replace("http://", "");
                }
                if (data.ip) {
                    data.ip = data.ip.replace("https://", "").replace("http://", "");
                }

                let application = await Applications.findOne({
                    where: {
                        id: req.params.id
                    }
                });
                if (userValid.id !== application.users_id) {
                    if (userValid.level === 1) {
                        return res.status(401).json({
                            "message": "User cannot access this record"
                        });
                    } else if (userValid.level === 2) {
                        let userApplication = await Users.findOne({
                            where: {
                                id: application.users_id
                            }
                        });
                        if (userApplication.customers_id !== userValid.customers_id) {
                            return res.status(401).json({
                                "message": "User cannot access this record"
                            });
                        }
                    }
                }
                let urlExist;
                let ipExist;
                if (data.url) {
                    urlExist = await Applications.findOne({
                        where: {
                            url: data.url,
                            users_telegram_id: data.users_telegram_id ? data.users_telegram_id : null,
                            triggers_id: data.triggers_id ? data.triggers_id : null,
                            port: req.body.port ? req.body.port : null,
                            protocol: data.protocol
                        }
                    });
                }
                if (data.ip) {
                    ipExist = await Applications.findOne({
                        where: {
                            ip: data.ip,
                            users_telegram_id: data.users_telegram_id ? data.users_telegram_id : null,
                            triggers_id: data.triggers_id ? data.triggers_id : null,
                            port: req.body.port ? req.body.port : null,
                            protocol: data.protocol
                        }
                    });
                }
                if (urlExist && urlExist.dataValues.id !== data.id) {
                    msg = `The url and port are already registered!!! ID: ${urlExist.dataValues.id}`
                    return res.status(406).json({
                        "message": msg
                    });

                } else if (ipExist && ipExist.dataValues.id !== data.id) {
                    msg = `The ip and port are already registered!!! ID: ${ipExist.dataValues.id}`
                    return res.status(406).json({
                        "message": msg
                    });
                } else {
                    let save = await Applications.update({
                        name: data.name,
                        protocol: data.protocol,
                        users_telegram_id: data.users_telegram_id,
                        triggers_id: data.triggers_id,
                        url: data.url,
                        ip: data.ip,
                        port: data.port
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
                            users_telegram_id: data.users_telegram_id,
                            triggers_id: data.triggers_id,
                            protocol: data.protocol,
                            url: data.url,
                            ip: data.ip,
                            port: data.port
                        });
                        return res.status(200).json(values);
                    }
                }
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
     * deleteApplication
     * @param {Object} req
     * @param {Object} res
     * @method DELETE
     * @route /applications/:id
     */
    controller.deleteApplication = async (req, res) => {
        try {
            const userValid = await Auth.validaUser(req);
            if (userValid) {
                let applications = await Applications.findOne({
                    where: {
                        id: req.params.id
                    }
                });
                if (applications) {
                    if (userValid.id !== applications.users_id) {
                        if (userValid.level === 1) {
                            return res.status(401).json({
                                "message": "User cannot access this record"
                            });
                        } else if (userValid.level === 2) {
                            let userApplication = await Users.findOne({
                                where: {
                                    id: applications.users_id
                                }
                            });
                            if (userApplication.customers_id !== userValid.customers_id) {
                                return res.status(401).json({
                                    "message": "User cannot access this record"
                                });
                            }
                        }
                    }
                    let appDelete = await Applications.destroy({
                        where: {
                            id: req.params.id
                        }
                    });
                    if (appDelete) {
                        return res.status(200).json(applications);
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
     * deleteApplications
     * @param {Object} req
     * @param {Object} res
     * @method DELETE
     * @route /applications
     */
    controller.deleteApplications = async (req, res) => {
        try {
            const userValid = await Auth.validaUser(req);
            if (userValid) {
                let ids = req.body.id
                for (let i = 0; i < ids.length; i++) {
                    let application = await Applications.findOne({
                        where: {
                            id: ids[i]
                        }
                    });
                    if (userValid.id !== application.users_id) {
                        if (userValid.level === 1) {
                            return res.status(401).json({
                                "message": "User cannot access this record"
                            });
                        } else if (userValid.level === 2) {
                            let userApplication = await Users.findOne({
                                where: {
                                    id: application.users_id
                                }
                            });
                            if (userApplication.customers_id !== userValid.customers_id) {
                                return res.status(401).json({
                                    "message": "User cannot access this record"
                                });
                            }
                        }
                    }
                    await Applications.destroy({
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