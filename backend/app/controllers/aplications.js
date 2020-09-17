const auth = require('./auth');

module.exports = function (app) {
    let controller = {};
    const Applications = app.models.aplications;
    const Auth = new auth(app);

    /**
     * index
     * @param {Object} req
     * @param {Object} res
     * @method GET
     * @route /applications
     */
    controller.getApplications = async (req, res) => {
        const userValid = await Auth.validaUser(req);
        if (userValid) {
            let applications = await Applications.findAll({
                where: {
                    users_id: userValid.id
                }
            });
            res.status(200).send(applications)
        } else {
            res.status(500).json("error: fail get applications")
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
        const userValid = await Auth.validaUser(req);
        if (userValid) {
            let applications = await Applications.findAll({
                where: {
                    users_id: userValid.id,
                    id: req.params.id
                }
            });
            res.status(200).send(applications[0])
        } else {
            res.status(500).json("error: fail get applications")
        }
    }

    /**
     * addApplication
     * @param {Object} req
     * @param {Object} res
     * @method POST
     * @route /applications
     */
    controller.addApplication = async (req, res) => {
        const userValid = await Auth.validaUser(req);
        let msg = "";
        let url;
        let ip;
        if (userValid) {

            if (req.body.url) {
                url = req.body.url.replace("https://", "").replace("http://", "");
            }
            if (req.body.ip) {
                ip = req.body.ip.replace("https://", "").replace("http://", "");
            }
            let urlExist;
            let ipExist;
            if (url) {
                urlExist = await Applications.findOne({
                    where: {
                        users_id: userValid.id,
                        url: url,
                        port: req.body.port ? req.body.port : null,
                        protocol: req.body.protocol
                    }
                });
            }
            if (ip) {
                ipExist = await Applications.findOne({
                    where: {
                        users_id: userValid.id,
                        ip: ip,
                        port: req.body.port ? req.body.port : null,
                        protocol: req.body.protocol
                    }
                });
            }
            if (urlExist) {
                msg = `The url and port are already registered!!! ID: ${urlExist.dataValues.id}`
                res.status(406).json(msg)

            } else if (ipExist) {
                msg = `The ip and port are already registered!!! ID: ${ipExist.dataValues.id}`
                res.status(406).json(msg)
            } else {
                let salvo = await Applications.create({
                    users_id: userValid.id,
                    description: req.body.description,
                    protocol: req.body.protocol,
                    url: url,
                    ip: ip,
                    port: req.body.port
                });
                if (salvo) {
                    let values = []
                    values.push({
                        id: salvo.dataValues.id,
                        description: req.body.description,
                        protocol: req.body.protocol,
                        url: url,
                        ip: ip,
                        port: req.body.port
                    });
                    res.status(200).send(values);
                }
            }
        } else {
            res.status(401).send("error: user invalid");
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
        const userValid = await Auth.validaUser(req);
        let msg;
        if (userValid) {
            let data = req.body;
            let urlExist;
            let ipExist;
            if (data.url) {
                urlExist = await Applications.findOne({
                    where: {
                        url: data.url,
                        port: req.body.port ? req.body.port : null,
                        protocol: data.protocol
                    }
                });
            }
            if (data.ip) {
                ipExist = await Applications.findOne({
                    where: {
                        ip: data.ip,
                        port: req.body.port ? req.body.port : null,
                        protocol: data.protocol
                    }
                });
            }
            if (urlExist) {
                msg = `The url and port are already registered!!! ID: ${urlExist.dataValues.id}`
                res.status(406).json(msg)

            } else if (ipExist) {
                msg = `The ip and port are already registered!!! ID: ${ipExist.dataValues.id}`
                res.status(406).json(msg)
            } else {
                let save = await Applications.update({
                    description: data.description,
                    protocol: data.protocol,
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
                        description: data.description,
                        protocol: data.protocol,
                        url: data.url,
                        ip: data.ip,
                        port: data.port
                    });
                    res.status(200).send(values);
                }
            }
        } else {
            res.status(401).send("error: user invalid");
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
        const userValid = await Auth.validaUser(req);
        if (userValid) {
            let applications = await Applications.findOne({
                where: {
                    id: req.params.id
                }
            });
            if (applications) {
                applications = applications.dataValues;
                let appDelete = await Applications.destroy({
                    where: {
                        id: req.params.id
                    }
                });
                if (appDelete) {
                    res.status(200).send(applications);
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
     * deleteApplications
     * @param {Object} req
     * @param {Object} res
     * @method DELETE
     * @route /applications
     */
    controller.deleteApplications = async (req, res) => {
        const userValid = await Auth.validaUser(req);
        if (userValid) {
            let ids = req.body.id
            for (let i = 0; i < ids.length; i++) {
                await Applications.destroy({
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