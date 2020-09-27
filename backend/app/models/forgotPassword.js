let Sequelize = require('sequelize');
module.exports = function (app) {
	
	let Forgot = app.sequelize.define('forgot_password', {
		id: {
			type: Sequelize.INTEGER,
			autoIncrement: true,
			primaryKey: true,
			allowNull: false
		},
		email: {
			type: Sequelize.STRING(255),
			allowNull: false
		},
		hash: {
			type: Sequelize.STRING(255),
			allowNull: false
        },
        created_date: {
			type: Sequelize.DATE(),
			allowNull: false
		},
	}, {
		createdAt: false,
		updatedAt: false,
		deletedAt: false,
		freezeTableName: true,
		tableName: 'forgot_password'
	});

	return Forgot;
};
