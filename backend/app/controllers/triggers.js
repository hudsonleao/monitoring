const auth = require("./auth");
module.exports = function (app) {
    let controller = {};
    const Triggers = app.models.triggers;
    const Auth = new auth(app);

    /**
     * getTriggers
     * @param {Object} req
     * @param {Object} res
     * @method GET
     * @route /triggers
     */
    controller.getTriggers = async (req, res) => {
        const userValid = await Auth.validaUser(req);
        if (userValid) {
            let telegram;
            if (userValid.level == 3) {
                telegram = await Triggers.findAll();
            } else if (userValid.level == 2) {
                telegram = await Triggers.findAll({
                    where: {
                        id: userValid.id
                    }
                });
            } else {
                telegram = [];
            }
            res.status(200).send(telegram)
        } else {
            res.status(401).json({ message: 'error: user invalid' })
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
        const userValid = await Auth.validaUser(req);
        if (userValid) {
            let servers = await Triggers.findOne({
                where: {
                    id: req.params.id
                }
            });
            res.status(200).send(servers)
        } else {
            res.status(500).json("error: fail get telegram")
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
                return res.status(500).send(msg)

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
                    return res.status(200).send(values)
                }
            }
        } else {
            return res.status(401).json({ message: 'error: user invalid' })
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
        const userValid = await Auth.validaUser(req);
        if (userValid) {
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
                res.status(200).send(values);
            }
        } else {
            res.status(401).send("error: user invalid");
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
        const userValid = await Auth.validaUser(req);
        if (userValid) {
            let trigger = await Triggers.findOne({
                where: {
                    id: req.params.id
                }
            });
            if (trigger) {
                let triggerDelete = await Triggers.destroy({
                    where: {
                        id: req.params.id
                    }
                });
                if (triggerDelete) {
                    res.status(200).send(trigger);
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
 * deleteTriggers
 * @param {Object} req
 * @param {Object} res
 * @method DELETE
 * @route /triggers
 */
    controller.deleteTriggers = async (req, res) => {
        const userValid = await Auth.validaUser(req);
        if (userValid) {
            let ids = req.body.id
            for (let i = 0; i < ids.length; i++) {
                await Triggers.destroy({
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