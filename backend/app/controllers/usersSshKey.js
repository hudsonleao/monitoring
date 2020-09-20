const auth = require('./auth');
const util = require('util');
const exec = util.promisify(require('child_process').exec);
const fsPromisse = require('await-fs');
const fs = require('fs');
const randomstring = require("randomstring");
const { Op } = require("sequelize");

module.exports = function (app) {
    let controller = {};
    const UsersSshKey = app.models.usersSshKey;
    const Auth = new auth(app);


    /**
     * index
     * @param {Object} req
     * @param {Object} res
     * @method GET
     * @route /ssh_key
     */
    controller.getUsersSshKey = async (req, res) => {
        const userValid = await Auth.validaUser(req);
        if (userValid) {
            let usersSshKey;
            if (userValid.level == 3) {
                usersSshKey = await UsersSshKey.findAll();
            } else if (userValid.level == 2) {
                usersSshKey = await UsersSshKey.findAll({
                    where: {
                        id: userValid.id
                    }
                });
            } else {
                usersSshKey = [];
            }
            res.status(200).send(usersSshKey)
        } else {
            res.status(500).json({ message: 'error: user invalid' })
        }
    }

    /**
* getUser
* @param {Object} req
* @param {Object} res
* @method GET
* @route /ssh_key/:id
*/
    controller.getUserSshKey = async (req, res) => {
        const userValid = await Auth.validaUser(req);
        if (userValid) {
            let plans = await UsersSshKey.findAll({
                where: {
                    id: req.params.id
                }
            });
            res.status(200).send(plans[0])
        } else {
            res.status(500).json("error: fail get plans")
        }
    }

    /**
* createUserSshKey
* @param {Object} req
* @param {Object} res
* @method POST
* @route /ssh_key
*/
    controller.createUserSshKey = async (req, res) => {
        const userValid = await Auth.validaUser(req);
        if (userValid) {

            let nameExist = await UsersSshKey.findOne({
                where: {
                    name: req.body.name
                }
            });

            if (nameExist) {
                return res.status(406).json("error: existing name");
            }

            let folder = `../keys_ssh/${userValid.user}`;

            let keyName;

            if (!fs.existsSync(folder)) {
                await fs.mkdirSync(folder);
            }

            keyName = `id_rsa_${randomstring.generate()}`;

            await exec(`ssh-keygen -C ${userValid.user} -f ${folder}/${keyName} -N ""`);

            let key = await fsPromisse.readFile(`${folder}/${keyName}.pub`, 'utf-8');

            await UsersSshKey.create({
                users_id: userValid.id,
                name: req.body.name,
                ssh_key: key,
                key_name: keyName,
                expiration_date: req.body.expiration_date
            });
            res.status(200).json("ssh key created")
        } else {
            res.status(401).send("error: user invalid");
        }
    }

    /**
* updateUserSshKey
* @param {Object} req
* @param {Object} res
* @method PUT
* @route /ssh_key/:id
*/
    controller.updateUserSshKey = async (req, res) => {
        const userValid = await Auth.validaUser(req);
        if (userValid) {

            let userSshKey = await UsersSshKey.findOne({
                where: {
                    id: req.params.id
                }
            });

            let nameExist = await UsersSshKey.findOne({
                where: {
                    id: {
                        [Op.not]: req.params.id,
                    },
                    name: req.body.name
                }

            });
            if (nameExist) {
                return res.status(406).json("error: existing name");
            }

            if (req.body.generate_new_ssh_key) {
                if (req.body.generate_new_ssh_key === true) {
                    let folder = `../keys_ssh/${userValid.user}`;

                    if (fs.existsSync(`${folder}/${userSshKey.key_name}`)) {
                        await fs.unlinkSync(`${folder}/${userSshKey.key_name}`);
                        if (fs.existsSync(`${folder}/${userSshKey.key_name}.pub`)) {
                            await fs.unlinkSync(`${folder}/${userSshKey.key_name}.pub`);
                        }
                    }

                    await exec(`ssh-keygen -C ${userValid.user} -f ${folder}/${userSshKey.key_name} -N ""`);

                    let key = await fsPromisse.readFile(`${folder}/${userSshKey.key_name}.pub`, 'utf-8');
                    let save = await UsersSshKey.update({
                        name: req.body.name,
                        ssh_key: key,
                        expiration_date: req.body.expiration_date
                    }, {
                        where: {
                            id: req.params.id
                        }
                    });
                    if (save) {
                        let values = []
                        values.push({
                            name: req.body.name,
                            ssh_key: key,
                            expiration_date: req.body.expiration_date
                        });
                        res.status(200).send(values);
                    }
                } else {
                    let save = await UsersSshKey.update({
                        name: req.body.name,
                        expiration_date: req.body.expiration_date
                    }, {
                        where: {
                            id: req.params.id
                        }
                    });
                    if (save) {
                        let values = []
                        values.push({
                            users_id: userValid.id,
                            name: req.body.name,
                            expiration_date: req.body.expiration_date
                        });
                        res.status(200).send(values);
                    }
                }
            } else {
                let save = await UsersSshKey.update({
                    name: req.body.name,
                    expiration_date: req.body.expiration_date
                }, {
                    where: {
                        id: req.params.id
                    }
                });
                if (save) {
                    let values = []
                    values.push({
                        users_id: userValid.id,
                        name: req.body.name,
                        expiration_date: req.body.expiration_date
                    });
                    res.status(200).send(values);
                }
            }
        } else {
            res.status(401).send("error: user invalid");
        }
    }

    /**
* deleteUserSshKey
* @param {Object} req
* @param {Object} res
* @method DELETE
* @route /ssh_key/:id
*/
    controller.deleteUserSshKey = async (req, res) => {
        const userValid = await Auth.validaUser(req);
        if (userValid) {
            let userSshKey = await UsersSshKey.findOne({
                where: {
                    id: req.params.id
                }
            });

            let folder = `../keys_ssh/${userValid.user}`;

            if (fs.existsSync(`${folder}/${userSshKey.key_name}`)) {
                await fs.unlinkSync(`${folder}/${userSshKey.key_name}`);
                if (fs.existsSync(`${folder}/${userSshKey.key_name}.pub`)) {
                    await fs.unlinkSync(`${folder}/${userSshKey.key_name}.pub`);
                }
            }
            let keyDelete = await UsersSshKey.destroy({
                where: {
                    id: req.params.id
                }
            });
            if (keyDelete) {
                res.status(200).send(userSshKey);
            } else {
                res.status(500).send("error: it was not possible to delete the data.");
            }
        } else {
            res.status(401).send("error: user invalid");
        }
    }

      /**
 * deleteUsersSshKey
 * @param {Object} req
 * @param {Object} res
 * @method DELETE
 * @route /ssh_key
 */
controller.deleteUsersSshKey = async (req, res) => {
    const userValid = await Auth.validaUser(req);
    if (userValid) {
        let ids = req.body.id
        for (let i = 0; i < ids.length; i++) {
            await UsersSshKey.destroy({
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
}