let Sequelize = require('sequelize');
module.exports = function (app) {
	
	let Plans = app.sequelize.define('plans', {
		id: {
			type: Sequelize.INTEGER,
			autoIncrement: true,
			primaryKey: true,
			allowNull: false
		},
		name: {
			type: Sequelize.STRING(255),
			allowNull: false
		},
		description: {
			type: Sequelize.STRING(255),
			allowNull: false
		},
		users_limit: {
			type: Sequelize.INTEGER,
			allowNull: false
        },
        applications_limit: {
			type: Sequelize.INTEGER,
			allowNull: false
		},
		servers_limit: {
			type: Sequelize.INTEGER,
			allowNull: false
		},
	}, {

		createdAt: false,
		updatedAt: false,
		deletedAt: false,
		freezeTableName: true,
		tableName: 'plans'
	});

	return Plans;
};
