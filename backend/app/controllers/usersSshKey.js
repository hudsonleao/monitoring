const auth = require('./auth');
const util = require('util');
const exec = util.promisify(require('child_process').exec);
const fsPromisse = require('await-fs');
const fs = require('fs');

module.exports = function (app) {
    let controller = {};
    const UsersSshKey = app.models.usersSshKey;
    const Auth = new auth(app);


    /**
     * index
     * @param {Object} req
     * @param {Object} res
     * @method GET
     * @route /sshkey
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
* @route /sshkey/:id
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
* @route /sshkey
*/
    controller.createUserSshKey = async (req, res) => {
        const userValid = await Auth.validaUser(req);
        if (userValid) {
            let existUsersSshKey = await UsersSshKey.findOne({
                where: {
                    users_id: userValid.id
                }
            });
            if (existUsersSshKey) {
                await UsersSshKey.destroy({
                    where: {
                        id: existUsersSshKey.id
                    }
                });
            }
            let folder = `../keys_ssh/${userValid.user}/`;

            if (!fs.existsSync(folder)) {
                await fs.mkdirSync(folder);
            }

            if (fs.existsSync(`${folder}/id_rsa`)) {
                await fs.unlinkSync(`${folder}/id_rsa`);
            }

            await exec(`ssh-keygen -C ${userValid.user} -f ${folder}/id_rsa -N ""`);

            let key = await fsPromisse.readFile(`${folder}/id_rsa.pub`, 'utf-8');
            
            await UsersSshKey.create({
                users_id: userValid.id,
                ssh_key: key
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
* @route /sshkey/:id
*/
    controller.updateUserSshKey = async (req, res) => {
        const userValid = await Auth.validaUser(req);
        if (userValid) {

            const { stdout, stderr } = await exec(`runuser -l ${userValid.user} -c "ssh-keygen -f ~/.ssh/id_rsa -N ''"`);
            if (stdout) {
                const { stdout, stderr } = await exec(`cat /home/${userValid.user}/.ssh/id_rsa.pub`);
                if (stdout) {

                    let save = await UsersSshKey.update({
                        users_id: userValid.id,
                        ssh_key: stdout
                    }, {
                        where: {
                            id: req.params.id
                        }
                    });
                    if (save) {
                        let values = []
                        values.push({
                            users_id: userValid.id,
                            ssh_key: stdout
                        });
                        res.status(200).send(values);
                    }
                } else {
                    console.log(stderr)
                    return res.status(500).json(stderr)
                }
            } else {
                console.log(stderr)
                return res.status(500).json(stderr)
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
* @route /sshkey/:id
*/
    controller.deleteUserSshKey = async (req, res) => {
        const userValid = await Auth.validaUser(req);
        if (userValid) {
            let plan = await UsersSshKey.findOne({
                where: {
                    id: req.params.id
                }
            });
            if (plan) {
                plan = plan.dataValues;
                let appDelete = await UsersSshKey.destroy({
                    where: {
                        id: req.params.id
                    }
                });
                if (appDelete) {
                    res.status(200).send(plan);
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


    return controller;
}