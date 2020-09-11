const auth = require("./auth");
module.exports = function (app) {
    let controller = {};
    const Users = app.models.users;
    const Auth = new auth(app);

    /**
     * index
     * @param {Object} req
     * @param {Object} res
     * @method GET
     * @route /users
     */
    controller.getUsers = async (req, res) => {
        const userValid = await Auth.validaUser(req);
        if (userValid) {
            let users;
            if (userValid.level == 3) {
                users = await Users.findAll();
            } else if (userValid.level == 2) {
                users = await Users.findAll({
                    where: {
                        id: userValid.id
                    }
                });
            } else {
                users = [];
            }
            res.status(200).send(users)
        } else {
            res.status(500).json({ message: 'error: user invalid' })
        }
    }

    /**
* getUser
* @param {Object} req
* @param {Object} res
* @method GET
* @route /users/:id
*/
    controller.getUser = async (req, res) => {
        const userValid = await Auth.validaUser(req);
        if (userValid) {
            let plans = await Users.findAll({
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
     * addUser
     * @param {Object} req
     * @param {Object} res
     * @method POST
     * @route /users
     */
    controller.addUser = async (req, res) => {
        const userValid = await Auth.validaUser(req);
        let msg;
        if (userValid) {

            let dados = req.body;
            let nome = dados.nome;
            let usuario = dados.usuario;
            let senha = dados.senha;
            senha = crypto.createHash('md5').update(senha).digest("hex");
            let userExist = await Users.findOne({
                where: {
                    usuario: usuario,
                    senha: senha
                }
            });
            if (userExist) {
                msg = `Usuário já cadastrado!!! ID: ${userExist.dataValues.id}`
                let value = [];
                value.push({
                    usuario: usuario,
                    senha: senha,
                    message: msg
                })
                res.render('adicionar-usuario', { exist: value, nivel: userValid.nivel })

            } else {
                let salvo = await Users.create({
                    nome: nome,
                    usuario: usuario,
                    senha: senha
                });
                if (salvo) {
                    let valores = []
                    valores.push({
                        id: salvo.dataValues.id,
                        usuario: dados.usuario,
                        senha: dados.senha
                    });
                    res.render('adicionar-usuario', { data: valores, nivel: userValid.nivel })
                }
            }
        } else {
            res.render('index', { erro: true })
        }
    }

    /**
 * updateUser
 * @param {Object} req
 * @param {Object} res
 * @method PUT
 * @route /users/:id
 */
    controller.updateUser = async (req, res) => {
        const userValid = await Auth.validaUser(req);
        if (userValid) {
            let data = req.body;
            let save = await Users.update({
                name: data.name,
                user: data.user,
                level: data.level
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
                    user: data.user,
                    level: data.level
                });
                res.status(200).send(values);
            }
        } else {
            res.status(401).send("error: user invalid");
        }
    }

    return controller;
};