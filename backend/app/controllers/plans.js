const auth = require('./auth');
module.exports = function (app) {
    let controller = {};
    const Plans = app.models.plans;
    const Auth = new auth(app);

    /**
     * getPlans
     * @param {Object} req
     * @param {Object} res
     * @method GET
     * @route /plans
     */
    controller.getPlans = async (req, res) => {
        const userValid = await Auth.validaUser(req);
        if (userValid) {
            let plans;
            if (userValid.level === 3) {
                plans = await Plans.findAll();
            }
            res.status(200).send(plans)
        } else {
            res.status(500).json("error: fail get plans")
        }
    }

    /**
* getPlans
* @param {Object} req
* @param {Object} res
* @method GET
* @route /plans/:id
*/
    controller.getPlan = async (req, res) => {
        const userValid = await Auth.validaUser(req);
        if (userValid) {
            let plans = await Plans.findAll({
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
 * addPlan
 * @param {Object} req
 * @param {Object} res
 * @method POST
 * @route /plan
 */
    controller.addPlan = async (req, res) => {
        const userValid = await Auth.validaUser(req);
        if (userValid) {

            let planExist = await Plans.findOne({
                where: {
                    name: req.body.name,
                }
            });

            if (planExist) {
                let msg = `The plan are already registered!!! ID: ${planExist.dataValues.id}`
                res.status(406).json(msg)

            } else {
                let save = await Plans.create({
                    name: req.body.name,
                    description: req.body.description,
                    users_limit: req.body.users_limit,
                    applications_limit: req.body.applications_limit,
                    servers_limit: req.body.servers_limit
                });
                if (save) {
                    let values = []
                    values.push({
                        id: save.dataValues.id,
                        name: req.body.name,
                        description: req.body.description,
                        users_limit: req.body.users_limit,
                        applications_limit: req.body.applications_limit,
                        servers_limit: req.body.servers_limit
                    });
                    res.status(200).send(values);
                }
            }
        } else {
            res.status(401).send("error: user invalid");
        }
    }
    /**
     * updatePlan
     * @param {Object} req
     * @param {Object} res
     * @method PUT
     * @route /plans/:id
     */
    controller.updatePlan = async (req, res) => {
        const userValid = await Auth.validaUser(req);
        let msg;
        if (userValid) {
            let planExist = await Plans.findOne({
                where: {
                    name: req.body.name
                }
            });
            if (planExist && planExist.dataValues.id !== req.body.id) {
                msg = `The plan are already registered!!! ID: ${planExist.dataValues.id}`
                res.status(406).json(msg)

            } else {
                let save = await Plans.update({
                    name: req.body.name,
                    description: req.body.description,
                    users_limit: req.body.users_limit,
                    applications_limit: req.body.applications_limit,
                    servers_limit: req.body.servers_limit
                }, {
                    where: {
                        id: req.body.id
                    }
                });
                if (save) {
                    let values = []
                    values.push({
                        id: req.body.id,
                        name: req.body.name,
                        description: req.body.description,
                        users_limit: req.body.users_limit,
                        applications_limit: req.body.applications_limit,
                        servers_limit: req.body.servers_limit
                    });
                    res.status(200).send(values);
                }
            }
        } else {
            res.status(401).send("error: user invalid");
        }
    }

     /**
     * deletePlan
     * @param {Object} req
     * @param {Object} res
     * @method DELETE
     * @route /plans/:id
     */
    controller.deletePlan = async (req, res) => {
        const userValid = await Auth.validaUser(req);
        if (userValid) {
            let plan = await Plans.findOne({
                where: {
                    id: req.params.id
                }
            });
            if (plan) {
                plan = plan.dataValues;
                let appDelete = await Plans.destroy({
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

    /**
     * deletePlans
     * @param {Object} req
     * @param {Object} res
     * @method DELETE
     * @route /plans
     */
    controller.deletePlans = async (req, res) => {
        const userValid = await Auth.validaUser(req);
        if (userValid) {
            let ids = req.body.id
            for (let i = 0; i < ids.length; i++) {
                await Plans.destroy({
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