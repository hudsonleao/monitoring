const auth = require("./auth");
module.exports = function (app) {
    let controller = {};
    const Servers = app.models.servers;
    const UsersSshKey = app.models.usersSshKey;
    const Auth = new auth(app);

    /**
     * getServers
     * @param {Object} req
     * @param {Object} res
     * @method GET
     * @route /servers
     */
    controller.getServers = async (req, res) => {
        const userValid = await Auth.validaUser(req);
        if (userValid) {
            let servers;
            if (userValid.level == 3) {
                servers = await Servers.findAll();
                for (let i = 0; i < servers.length; i++) {
                    let sshKey = await UsersSshKey.findOne({
                        where: {
                            id: servers[i].ssh_key_id
                        }
                    });
                    servers[i].ssh_key_id = sshKey.name
                }
            } else if (userValid.level == 2) {
                servers = await Servers.findAll({
                    where: {
                        id: userValid.id
                    }
                });
                for (let i = 0; i < servers.length; i++) {
                    let sshKey = await UsersSshKey.findOne({
                        where: {
                            id: servers[i].ssh_key_id
                        }
                    });
                    servers[i].ssh_key_id = sshKey.name
                }
            } else {
                servers = [];
            }
            res.status(200).send(servers)
        } else {
            res.status(401).json({ message: 'error: user invalid' })
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
        const userValid = await Auth.validaUser(req);
        if (userValid) {
            let servers = await Servers.findOne({
                where: {
                    id: req.params.id
                }
            });
            res.status(200).send(servers)
        } else {
            res.status(500).json("error: fail get servers")
        }
    }

    /**
     * addServer
     * @param {Object} req
     * @param {Object} res
     * @method POST
     * @route /servers
     */
    controller.addServer = async (req, res) => {
        const userValid = await Auth.validaUser(req);
        let msg;
        if (userValid) {

            let data = req.body;
            let serverExist = await Servers.findOne({
                where: {
                    users_id: userValid.id,
                    ip: data.ip
                }
            });
            if (serverExist) {
                msg = `The ip are already registered!!! ID: ${serverExist.dataValues.id}`
                return res.status(500).send(msg)

            } else {
                let save = await Servers.create({
                    users_id: userValid.id,
                    name: data.name,
                    ip: data.ip,
                    ssh_key_id: data.ssh_key_id
                });
                if (save) {
                    let values = []
                    values.push({
                        id: save.id,
                        users_id: userValid.id,
                        name: data.name,
                        ip: data.ip,
                        ssh_key_id: data.ssh_key_id
                    });
                    return res.status(200).send(values)
                }
            }
        } else {
            return res.status(401).json({ message: 'error: user invalid' })
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
        const userValid = await Auth.validaUser(req);
        if (userValid) {
            let data = req.body;
            let save = await Servers.update({
                name: data.name,
                ip: data.ip,
                ssh_key_id: data.ssh_key_id
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
                    ip: data.ip,
                    ssh_key_id: data.ssh_key_id
                });
                res.status(200).send(values);
            }
        } else {
            res.status(401).send("error: user invalid");
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
        const userValid = await Auth.validaUser(req);
        if (userValid) {
            let server = await Servers.findOne({
                where: {
                    id: req.params.id
                }
            });
            if (server) {
                let serverDelete = await Servers.destroy({
                    where: {
                        id: req.params.id
                    }
                });
                if (serverDelete) {
                    res.status(200).send(server);
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
 * deleteServers
 * @param {Object} req
 * @param {Object} res
 * @method DELETE
 * @route /servers
 */
    controller.deleteServers = async (req, res) => {
        const userValid = await Auth.validaUser(req);
        if (userValid) {
            let ids = req.body.id
            for (let i = 0; i < ids.length; i++) {
                await Servers.destroy({
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