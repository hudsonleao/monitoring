const auth = require('./auth');
module.exports = function (app) {
    let controller = {};
    const Customers = app.models.customers;
    const Plans = app.models.plans;
    const Auth = new auth(app);

    /**
     * getCustomers
     * @param {Object} req
     * @param {Object} res
     * @method GET
     * @route /customers
     */
    controller.getCustomers = async (req, res) => {
        const userValid = await Auth.validaUser(req);
        if (userValid) {
            let customers;
            if (userValid.level === 3) {
                customers = await Customers.findAll();
                for (let i = 0; i < customers.length; i++) {
                    let element = customers[i];
                    let plan = await Plans.findOne({
                        attributes: ['name'],

                        where: {
                            id: element.plans_id
                        }
                    });
                    element.plans_id = plan.name;
                }
            } else if (userValid.level === 2) {
                customers = await Customers.findAll({
                    where: {
                        id: userValid.customers_id
                    }
                });
                for (let i = 0; i < customers.length; i++) {
                    let element = customers[i];
                    let plan = await Plans.findOne({
                        attributes: ['name'],

                        where: {
                            id: element.plans_id
                        }
                    });
                    element.plans_id = plan.name;
                }
            }
            res.status(200).send(customers)
        } else {
            res.status(500).json("error: fail get customers")
        }
    }

    /**
    * getCustomers
    * @param {Object} req
    * @param {Object} res
    * @method GET
    * @route /customers/:id
    */
    controller.getCustomer = async (req, res) => {
        const userValid = await Auth.validaUser(req);
        if (userValid) {
            let customers = await Customers.findOne({
                where: {
                    id: req.params.id
                }
            });
            res.status(200).send(customers)
        } else {
            res.status(500).json("error: fail get applications")
        }
    }

    /**
         * addCustomers
         * @param {Object} req
         * @param {Object} res
         * @method POST
         * @route /customers
         */
    controller.addCustomers = async (req, res) => {
        const userValid = await Auth.validaUser(req);
        let msg = "";

        if (userValid) {
            let email = req.body.email;

            let emailExist = await Customers.findOne({
                where: {
                    email: email
                }
            })
            if (emailExist) {
                msg = `The email are already registered!!! ID: ${emailExist.dataValues.id}`
                res.status(406).json(msg)
            } else {
                let save = await Customers.create({
                    plans_id: req.body.plans_id,
                    name: req.body.name,
                    email: req.body.email,
                    address: req.body.address,
                    city: req.body.city,
                    phone_number: req.body.phone_number,
                    document: req.body.document,
                });
                if (save) {
                    let values = []
                    values.push({
                        id: save.dataValues.id,
                        plans_id: req.body.plans_id,
                        name: req.body.name,
                        email: req.body.email,
                        address: req.body.address,
                        city: req.body.city,
                        phone_number: req.body.phone_number,
                        document: req.body.document,
                    });
                    res.status(200).send(values);
                }
            }
        } else {
            res.status(401).send("error: user invalid");
        }
    }

    /**
     * updateCustomer
     * @param {Object} req
     * @param {Object} res
     * @method PUT
     * @route /customers/:id
     */
    controller.updateCustomer = async (req, res) => {
        const userValid = await Auth.validaUser(req);
        if (userValid) {
            let data = req.body;
            let save = await Customers.update({
                plans_id: data.plans_id,
                name: data.name,
                address: data.address,
                city: data.phone_number,
                document: data.document
            }, {
                where: {
                    id: data.id
                }
            });
            if (save) {
                let values = []
                values.push({
                    id: data.id,
                    plans_id: data.plans_id,
                    name: data.name,
                    address: data.address,
                    city: data.phone_number,
                    document: data.document
                });
                res.status(200).send(values);
            }
        } else {
            res.status(401).send("error: user invalid");
        }
    }

    return controller;
};