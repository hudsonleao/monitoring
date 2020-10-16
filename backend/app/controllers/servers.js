const auth = require("./auth");
module.exports = function (app) {
    let controller = {};
    const Servers = app.models.servers;
    const Users = app.models.users;
    const UsersSshKey = app.models.usersSshKey;
    const Customers = app.models.customers;
    const Plans = app.models.plans;
    const Auth = new auth(app);

    /**
     * getServers
     * @param {Object} req
     * @param {Object} res
     * @method GET
     * @route /servers
     */
    controller.getServers = async (req, res) => {
        try {
            const userValid = await Auth.validaUser(req);
            if (userValid) {
                let servers;
                if (userValid.level == 3) {
                    servers = await Servers.findAll();
                    for (let i = 0; i < servers.length; i++) {
                        if (servers[i].ssh_key_id) {
                            let sshKey = await UsersSshKey.findOne({
                                where: {
                                    id: servers[i].ssh_key_id
                                }
                            });
                            servers[i].ssh_key_id = sshKey.name
                        }
                    }
                } else if (userValid.level == 2) {

                    let allServers = [];

                    let users = await Users.findAll({
                        where: {
                            customers_id: userValid.customers_id
                        }
                    });

                    for (let i = 0; i < users.length; i++) {
                        let ServerPerUser = await Servers.findAll({
                            where: {
                                users_id: users[i].id
                            }
                        });
                        for (let j = 0; j < ServerPerUser.length; j++) {
                            allServers.push(ServerPerUser[j]);
                        }
                    }
                    servers = allServers;

                    for (let i = 0; i < servers.length; i++) {
                        if (servers[i].ssh_key_id) {
                            let sshKey = await UsersSshKey.findOne({
                                where: {
                                    id: servers[i].ssh_key_id
                                }
                            });
                            servers[i].ssh_key_id = sshKey.name
                        }
                    }
                } else {
                    servers = await Servers.findAll({
                        where: {
                            users_id: userValid.id
                        }
                    });
                    for (let i = 0; i < servers.length; i++) {
                        if (servers[i].ssh_key_id) {
                            let sshKey = await UsersSshKey.findOne({
                                where: {
                                    id: servers[i].ssh_key_id
                                }
                            });
                            servers[i].ssh_key_id = sshKey.name
                        }
                    }
                }
                return res.status(200).json(servers)
            } else {
                return res.status(401).json({ message: 'user invalid' })
            }
        } catch (error) {
            console.log(error);
            return res.status(500).json(error)
        }
    }

    /**
* getServer
* @param {Object} req
* @param {Object} res
* @method GET
* @route /servers/:id
*/
    controller.getServer = async (req, res) => {
        try {
            const userValid = await Auth.validaUser(req);
            if (userValid) {
                let servers;
                if (userValid.level === 3) {
                    servers = await Servers.findOne({
                        where: {
                            id: req.params.id
                        }
                    });
                } else if (userValid.level === 2) {
                    servers = await Servers.findOne({
                        where: {
                            id: req.params.id
                        }
                    });
                    let userServer = await Users.findOne({
                        where: {
                            id: servers.users_id
                        }
                    });
                    if (userServer.customers_id !== userValid.customers_id) {
                        return res.status(401).json({
                            message: "User cannot access this record "
                        })
                    }
                } else {
                    servers = await Servers.findOne({
                        where: {
                            id: req.params.id,
                            users_id: userValid.users_id
                        }
                    });
                    if (servers === null || servers === undefined || servers === "") {
                        return res.status(401).json({
                            message: "User cannot access this record "
                        });
                    }
                }
                return res.status(200).json(servers)
            } else {
                return res.status(500).json("error: fail get servers")
            }
        } catch (error) {
            console.log(error);
            return res.status(500).json(error)
        }
    }

    /**
     * createServer
     * @param {Object} req
     * @param {Object} res
     * @method POST
     * @route /servers
     */
    controller.createServer = async (req, res) => {
        try {
            const userValid = await Auth.validaUser(req);
            let msg;
            if (userValid) {

                let data = req.body;
                let serverExist = await Servers.findOne({
                    where: {
                        users_id: userValid.id,
                        server_ip: data.server_ip,
                        server_user: data.server_user ? data.server_user : 'root',
                        server_ssh_port: data.server_ssh_port ? data.server_ssh_port : 22,
                    }
                });
                if (serverExist) {
                    msg = `The ip are already registered!!! ID: ${serverExist.dataValues.id}`
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
                        });

                        let users = await Users.findAll({
                            where: {
                                customers_id: userValid.customers_id
                            }
                        });

                        let quantity = 0;

                        for (let i = 0; i < users.length; i++) {
                            const element = users[i];
                            let servers = await Servers.findAll({
                                where: {
                                    users_id: element.id
                                }
                            });
                            if (servers.length > 0) {
                                quantity = parseInt(quantity) + parseInt(servers.length)
                            }
                        }

                        if (quantity >= plan.servers_limit) {
                            return res.status(401).json({
                                "message": "Servers limit reached"
                            });
                        }
                    }

                    let save = await Servers.create({
                        users_id: userValid.id,
                        name: data.name,
                        server_ip: data.server_ip,
                        server_user: data.server_user ? data.server_user : 'root',
                        server_ssh_port: data.server_ssh_port ? data.server_ssh_port : 22,
                        ssh_key_id: data.ssh_key_id
                    });
                    if (save) {
                        let values = []
                        values.push({
                            id: save.id,
                            users_id: userValid.id,
                            name: data.name,
                            server_ip: data.server_ip,
                            server_user: data.server_user ? data.server_user : 'root',
                            server_ssh_port: data.server_ssh_port ? data.server_ssh_port : 22,
                            ssh_key_id: data.ssh_key_id
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
 * updateServer
 * @param {Object} req
 * @param {Object} res
 * @method PUT
 * @route /servers/:id
 */
    controller.updateServer = async (req, res) => {
        try {
            const userValid = await Auth.validaUser(req);
            if (userValid) {
                let server = await Servers.findOne({
                    where: {
                        id: req.params.id
                    }
                });
                if (userValid.id !== server.users_id) {
                    if (userValid.level === 1) {
                        return res.status(401).json({
                            "message": "User cannot access this record"
                        });
                    } else if (userValid.level === 2) {
                        let userServer = await Users.findOne({
                            where: {
                                id: server.users_id
                            }
                        });
                        if (userServer.customers_id !== userValid.customers_id) {
                            return res.status(401).json({
                                "message": "User cannot access this record"
                            });
                        }
                    }
                }
                let data = req.body;
                let save = await Servers.update({
                    name: data.name,
                    server_ip: data.server_ip,
                    server_user: data.server_user ? data.server_user : 'root',
                    ssh_key_id: data.ssh_key_id,
                    server_ssh_port: data.server_ssh_port ? data.server_ssh_port : 22
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
                        server_ip: data.serverip,
                        server_user: data.server_user ? data.server_user : 'root',
                        server_ssh_port: data.server_ssh_port ? data.server_ssh_port : 22,
                        ssh_key_id: data.ssh_key_id
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
* deleteServer
* @param {Object} req
* @param {Object} res
* @method DELETE
* @route /servers/:id
*/
    controller.deleteServer = async (req, res) => {
        try {
            const userValid = await Auth.validaUser(req);
            if (userValid) {
                let server = await Servers.findOne({
                    where: {
                        id: req.params.id
                    }
                });
                if (server) {
                    if (userValid.id !== server.users_id) {
                        if (userValid.level === 1) {
                            return res.status(401).json({
                                "message": "User cannot access this record"
                            });
                        } else if (userValid.level === 2) {
                            let userServer = await Users.findOne({
                                where: {
                                    id: server.users_id
                                }
                            });
                            if (userServer.customers_id !== userValid.customers_id) {
                                return res.status(401).json({
                                    "message": "User cannot access this record"
                                });
                            }
                        }
                    }
                    let serverDelete = await Servers.destroy({
                        where: {
                            id: req.params.id
                        }
                    });
                    if (serverDelete) {
                        return res.status(200).json(server);
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
 * deleteServers
 * @param {Object} req
 * @param {Object} res
 * @method DELETE
 * @route /servers
 */
    controller.deleteServers = async (req, res) => {
        try {
            const userValid = await Auth.validaUser(req);
            if (userValid) {
                let ids = req.body.id
                for (let i = 0; i < ids.length; i++) {
                    let server = await Servers.findOne({
                        where: {
                            id: ids[i]
                        }
                    });
                    if (userValid.id !== server.users_id) {
                        if (userValid.level === 1) {
                            return res.status(401).json({
                                "message": "User cannot access this record"
                            });
                        } else if (userValid.level === 2) {
                            let userServer = await Users.findOne({
                                where: {
                                    id: server.users_id
                                }
                            });
                            if (userServer.customers_id !== userValid.customers_id) {
                                return res.status(401).json({
                                    "message": "User cannot access this record"
                                });
                            }
                        }
                    }
                    await Servers.destroy({
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