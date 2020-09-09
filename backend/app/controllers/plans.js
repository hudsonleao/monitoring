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

    return controller;
}