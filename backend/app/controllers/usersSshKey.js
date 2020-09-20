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
    const Users = app.models.users;
    const Auth = new auth(app);


    /**
     * index
     * @param {Object} req
     * @param {Object} res
     * @method GET
     * @route /ssh_key
     */
    controller.getUsersSshKey = async (req, res) => {
        try {
            const userValid = await Auth.validaUser(req);
            if (userValid) {
                let usersSshKey;
                if (userValid.level == 3) {
                    usersSshKey = await UsersSshKey.findAll();
                } else if (userValid.level == 2) {
                    let allTriggers = [];
                    let users = await Users.findAll({
                        where: {
                            customers_id: userValid.customers_id
                        }
                    });
                    for (let i = 0; i < users.length; i++) {
                        let sshkey = await UsersSshKey.findAll({
                            where: {
                                users_id: users[i].id
                            }
                        });
                        for (let z = 0; z < sshkey.length; z++) {
                            allTriggers.push(sshkey[z]);
                        }
                    }

                    usersSshKey = allTriggers
                } else {
                    usersSshKey = await UsersSshKey.findAll({
                        where: {
                            users_id: userValid.id
                        }
                    });
                }
                return res.status(200).json(usersSshKey)
            } else {
                return res.status(500).json({ message: 'error: user invalid' })
            }
        } catch (error) {
            console.log(error);
            return res.status(500).json(error)
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
        try {
            const userValid = await Auth.validaUser(req);
            if (userValid) {
                let usersSshKey
                if (userValid.level === 3) {
                    usersSshKey = await UsersSshKey.findOne({
                        where: {
                            id: req.params.id
                        }
                    });
                } else if (userValid.level === 2) {
                    usersSshKey = await UsersSshKey.findOne({
                        where: {
                            id: req.params.id
                        }
                    });
                    let userApplication = await Users.findOne({
                        where: {
                            id: usersSshKey.users_id
                        }
                    });
                    if (userApplication.customers_id !== userValid.customers_id) {
                        return res.status(401).json({
                            message: "User cannot access this record "
                        })
                    }
                } else {
                    usersSshKey = await UsersSshKey.findOne({
                        where: {
                            id: req.params.id,
                            users_id: userValid.users_id
                        }
                    });
                    if (usersSshKey === null || usersSshKey === undefined || usersSshKey === "") {
                        return res.status(401).json({
                            message: "User cannot access this record "
                        });
                    }
                }
                return res.status(200).json(usersSshKey)
            } else {
                return res.status(500).json("error: fail get plans")
            }
        } catch (error) {
            console.log(error);
            return res.status(500).json(error)
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
        try {
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
                return res.status(200).json("ssh key created")
            } else {
                return res.status(401).json("error: user invalid");
            }
        } catch (error) {
            console.log(error);
            return res.status(500).json(error)
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
        try {
            const userValid = await Auth.validaUser(req);
            if (userValid) {

                let userSshKey = await UsersSshKey.findOne({
                    where: {
                        id: req.params.id
                    }
                });
                if (userValid.id !== userSshKey.users_id) {
                    if (userValid.level === 1) {
                        return res.status(401).json({
                            "message": "User cannot access this record"
                        });
                    } else if (userValid.level === 2) {
                        let sshkey = await Users.findOne({
                            where: {
                                id: userSshKey.users_id
                            }
                        });
                        if (sshkey.customers_id !== userValid.customers_id) {
                            return res.status(401).json({
                                "message": "User cannot access this record"
                            });
                        }
                    }
                }
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
                            return res.status(200).json(values);
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
                            return res.status(200).json(values);
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
* deleteUserSshKey
* @param {Object} req
* @param {Object} res
* @method DELETE
* @route /ssh_key/:id
*/
    controller.deleteUserSshKey = async (req, res) => {
        try {
            const userValid = await Auth.validaUser(req);
            if (userValid) {
                let userSshKey = await UsersSshKey.findOne({
                    where: {
                        id: req.params.id
                    }
                });
                if (userValid.id !== userSshKey.users_id) {
                    if (userValid.level === 1) {
                        return res.status(401).json({
                            "message": "User cannot access this record"
                        });
                    } else if (userValid.level === 2) {
                        let sshkey = await Users.findOne({
                            where: {
                                id: userSshKey.users_id
                            }
                        });
                        if (sshkey.customers_id !== userValid.customers_id) {
                            return res.status(401).json({
                                "message": "User cannot access this record"
                            });
                        }
                    }
                }

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
                    return res.status(200).json(userSshKey);
                } else {
                    return res.status(500).json("error: it was not possible to delete the data.");
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
* deleteUsersSshKey
* @param {Object} req
* @param {Object} res
* @method DELETE
* @route /ssh_key
*/
    controller.deleteUsersSshKey = async (req, res) => {
        try {
            const userValid = await Auth.validaUser(req);
            if (userValid) {
                let ids = req.body.id
                for (let i = 0; i < ids.length; i++) {
                    let userSshKey = await UsersSshKey.findOne({
                        where: {
                            id: ids[i]
                        }
                    });
                    if (userValid.id !== userSshKey.users_id) {
                        if (userValid.level === 1) {
                            return res.status(401).json({
                                "message": "User cannot access this record"
                            });
                        } else if (userValid.level === 2) {
                            let sshkey = await Users.findOne({
                                where: {
                                    id: userSshKey.users_id
                                }
                            });
                            if (sshkey.customers_id !== userValid.customers_id) {
                                return res.status(401).json({
                                    "message": "User cannot access this record"
                                });
                            }
                        }
                    }
                    await UsersSshKey.destroy({
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
}