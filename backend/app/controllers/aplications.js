const auth = require('./auth');

module.exports = function (app) {
    let controller = {};
    const Applications = app.models.aplications;
    const Users = app.models.users;
    const Telegram = app.models.usersTelegram;
    const Triggers = app.models.triggers;
    const Servers = app.models.servers;
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
                let telegram;
                let trigger;
                let servers;
                if (userValid.level === 3) {
                    applications = await Applications.findAll();
                    if (applications.length > 0) {
                        for (let i = 0; i < applications.length; i++) {
                            if (applications[i].users_telegram_id) {
                                telegram = await Telegram.findOne({
                                    attributes: ['name'],
                                    where: {
                                        id: applications[i].users_telegram_id
                                    }
                                });
                                if (telegram) {
                                    applications[i].users_telegram_id = telegram.name;
                                }
                            }
                            if (applications[i].triggers_id) {
                                trigger = await Triggers.findOne({
                                    attributes: ['name'],
                                    where: {
                                        id: applications[i].triggers_id
                                    }
                                });
                                if (trigger) {
                                    applications[i].triggers_id = trigger.name
                                }
                            }
                            if (applications[i].servers_id) {
                                servers = await Servers.findOne({
                                    attributes: ['name'],
                                    where: {
                                        id: applications[i].servers_id
                                    }
                                });
                                if (servers) {
                                    applications[i].servers_id = servers.name
                                }
                            }
                        }
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
                        if (applicationsPerUser.length > 0) {
                            for (let j = 0; j < applicationsPerUser.length; j++) {
                                allApplications.push(applicationsPerUser[j]);
                            }
                        }
                    }
                    if (allApplications.length > 0) {
                        for (let i = 0; i < allApplications.length; i++) {
                            if (allApplications[i].users_telegram_id) {
                                telegram = await Telegram.findOne({
                                    attributes: ['name'],
                                    where: {
                                        id: allApplications[i].users_telegram_id
                                    }
                                });
                                if (telegram) {
                                    allApplications[i].users_telegram_id = telegram.name;
                                }
                            }
                            if (allApplications[i].triggers_id) {
                                trigger = await Triggers.findOne({
                                    attributes: ['name'],
                                    where: {
                                        id: allApplications[i].triggers_id
                                    }
                                });
                                if (trigger) {
                                    allApplications[i].triggers_id = trigger.name
                                }
                            }
                            if (applications[i].servers_id) {
                                servers = await Servers.findOne({
                                    attributes: ['name'],
                                    where: {
                                        id: applications[i].servers_id
                                    }
                                });
                                if (servers) {
                                    applications[i].servers_id = servers.name
                                }
                            }
                        }
                        applications = allApplications
                    }
                } else {
                    applications = await Applications.findAll({
                        where: {
                            users_id: userValid.id
                        }
                    });
                    if (applications.length > 0) {
                        for (let i = 0; i < applications.length; i++) {
                            if (applications[i].users_telegram_id) {
                                telegram = await Telegram.findOne({
                                    attributes: ['name'],
                                    where: {
                                        id: applications[i].users_telegram_id
                                    }
                                });
                                if (telegram) {
                                    applications[i].users_telegram_id = telegram.name;
                                }
                            }
                            if (applications[i].triggers_id) {
                                trigger = await Triggers.findOne({
                                    attributes: ['name'],
                                    where: {
                                        id: applications[i].triggers_id
                                    }
                                });
                                if (trigger) {
                                    applications[i].triggers_id = trigger.name;
                                }
                            }
                            if (applications[i].servers_id) {
                                servers = await Servers.findOne({
                                    attributes: ['name'],
                                    where: {
                                        id: applications[i].servers_id
                                    }
                                });
                                if (servers) {
                                    applications[i].servers_id = servers.name
                                }
                            }
                        }
                    }
                }
                if (!applications || applications === "" || applications === undefined) {
                    applications = []
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
                    if (applications) {
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
            let data = req.body
            if (userValid) {

                let urlOrPort = data.url_or_ip.replace("https://", "").replace("http://", "");

                let urlOrPortExist;
                if (urlOrPort) {
                    urlOrPortExist = await Applications.findOne({
                        where: {
                            users_id: userValid.id,
                            users_telegram_id: data.users_telegram_id ? data.users_telegram_id : null,
                            triggers_id: data.triggers_id ? data.triggers_id : null,
                            servers_id: data.servers_id ? data.servers_id : null,
                            url_or_ip: urlOrPort,
                            port: data.port ? data.port : null,
                            protocol: data.protocol,
                            check_interval: data.check_interval,
                            attempts_limit: data.attempts_limit,
                            correct_request_status: data.correct_request_status ? data.correct_request_status : 200
                        }
                    });
                }
                if (urlOrPortExist) {
                    msg = `The url or ip and port are already registered!!! ID: ${urlOrPortExist.id}`
                    return res.status(406).json({
                        "message": msg
                    });

                } else {
                    let save = await Applications.create({
                        users_id: userValid.id,
                        name: data.name,
                        users_telegram_id: data.users_telegram_id,
                        triggers_id: data.triggers_id,
                        servers_id: data.servers_id,
                        protocol: data.protocol,
                        url_or_ip: urlOrPort,
                        port: data.port,
                        queue_status: 'A',
                        check_interval: data.check_interval,
                        attempts_limit: data.attempts_limit,
                        next_check: parseInt(new Date().getTime()) + parseInt(data.check_interval),
                        created_date: new Date(),
                        correct_request_status: data.correct_request_status ? data.correct_request_status : 200
                    });
                    if (save) {
                        let values = []
                        values.push({
                            id: save.dataValues.id,
                            name: data.name,
                            users_telegram_id: data.users_telegram_id,
                            triggers_id: data.triggers_id,
                            servers_id: data.servers_id,
                            protocol: data.protocol,
                            url_or_ip: urlOrPort,
                            port: data.port,
                            queue_status: 'A',
                            check_interval: data.check_interval,
                            attempts_limit: data.attempts_limit,
                            next_check: parseInt(new Date().getTime()) + parseInt(data.check_interval),
                            created_date: new Date(),
                            correct_request_status: data.correct_request_status ? data.correct_request_status : 200
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
                data.url_or_ip = data.url_or_ip.replace("https://", "").replace("http://", "");

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
                let urlOrPortExist;
                urlOrPortExist = await Applications.findOne({
                    where: {
                        url_or_ip: data.url_or_ip,
                        users_telegram_id: data.users_telegram_id ? data.users_telegram_id : null,
                        triggers_id: data.triggers_id ? data.triggers_id : null,
                        servers_id: data.servers_id ? data.servers_id : null,
                        port: req.body.port ? req.body.port : null,
                        protocol: data.protocol,
                        correct_request_status: data.correct_request_status ? data.correct_request_status : 200,
                        check_interval: data.check_interval,
                        attempts_limit: data.attempts_limit
                    }
                });
                if (urlOrPortExist && urlOrPortExist.dataValues.id !== data.id) {
                    msg = `The url or ip and port are already registered!!! ID: ${urlOrPortExist.dataValues.id}`
                    return res.status(406).json({
                        "message": msg
                    });
                } else {
                    let save = await Applications.update({
                        name: data.name,
                        protocol: data.protocol,
                        users_telegram_id: data.users_telegram_id,
                        triggers_id: data.triggers_id,
                        servers_id: data.servers_id,
                        url_or_ip: data.url_or_ip,
                        port: data.port,
                        correct_request_status: data.correct_request_status ? data.correct_request_status : 200,
                        check_interval: data.check_interval,
                        attempts_limit: data.attempts_limit,
                        next_check: parseInt(new Date().getTime()) + parseInt(data.check_interval),
                        update_date: new Date()
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
                            servers_id: data.servers_id,
                            protocol: data.protocol,
                            url_or_ip: data.url_or_ip,
                            port: data.port,
                            correct_request_status: data.correct_request_status ? data.correct_request_status : 200,
                            check_interval: data.check_interval,
                            attempts_limit: data.attempts_limit,
                            next_check: parseInt(new Date().getTime()) + parseInt(data.check_interval),
                            update_date: new Date()
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