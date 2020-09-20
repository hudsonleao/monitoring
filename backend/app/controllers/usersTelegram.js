const auth = require("./auth");
module.exports = function (app) {
    let controller = {};
    const UsersTelegram = app.models.usersTelegram;
    const Auth = new auth(app);

    /**
     * getUsersTelegram
     * @param {Object} req
     * @param {Object} res
     * @method GET
     * @route /telegram
     */
    controller.getUsersTelegram = async (req, res) => {
        const userValid = await Auth.validaUser(req);
        if (userValid) {
            let telegram;
            if (userValid.level == 3) {
                telegram = await UsersTelegram.findAll();
            } else if (userValid.level == 2) {
                telegram = await UsersTelegram.findAll({
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
* getUsersTelegram
* @param {Object} req
* @param {Object} res
* @method GET
* @route /telegram/:id
*/
    controller.getUserTelegram = async (req, res) => {
        const userValid = await Auth.validaUser(req);
        if (userValid) {
            let servers = await UsersTelegram.findOne({
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
     * addUsersTelegram
     * @param {Object} req
     * @param {Object} res
     * @method POST
     * @route /telegram
     */
    controller.createUserTelegram = async (req, res) => {
        const userValid = await Auth.validaUser(req);
        let msg;
        if (userValid) {

            let data = req.body;
            let channelExist = await UsersTelegram.findOne({
                where: {
                    users_id: userValid.id,
                    telegram_channel_id: data.telegram_channel_id,
                    message: data.message
                }
            });
            if (channelExist) {
                msg = `The Telegram channel id are already registered!!! ID: ${channelExist.dataValues.id}`
                return res.status(500).send(msg)

            } else {
                let save = await UsersTelegram.create({
                    users_id: userValid.id,
                    name: data.name,
                    telegram_channel_id: data.telegram_channel_id,
                    message: data.message
                });
                if (save) {
                    let values = []
                    values.push({
                        id: save.id,
                        users_id: userValid.id,
                        name: data.name,
                        telegram_channel_id: data.telegram_channel_id,
                        message: data.message
                    });
                    return res.status(200).send(values)
                }
            }
        } else {
            return res.status(401).json({ message: 'error: user invalid' })
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
        const userValid = await Auth.validaUser(req);
        if (userValid) {
            let data = req.body;
            let save = await UsersTelegram.update({
                name: data.name,
                telegram_channel_id: data.telegram_channel_id,
                message: data.message
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
                    message: data.message
                });
                res.status(200).send(values);
            }
        } else {
            res.status(401).send("error: user invalid");
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
        const userValid = await Auth.validaUser(req);
        if (userValid) {
            let telegram = await UsersTelegram.findOne({
                where: {
                    id: req.params.id
                }
            });
            if (telegram) {
                let telegramDelete = await UsersTelegram.destroy({
                    where: {
                        id: req.params.id
                    }
                });
                if (telegramDelete) {
                    res.status(200).send(telegram);
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
 * deleteUsersTelegram
 * @param {Object} req
 * @param {Object} res
 * @method DELETE
 * @route /telegram
 */
    controller.deleteUsersTelegram = async (req, res) => {
        const userValid = await Auth.validaUser(req);
        if (userValid) {
            let ids = req.body.id
            for (let i = 0; i < ids.length; i++) {
                await UsersTelegram.destroy({
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