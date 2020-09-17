let Sequelize = require('sequelize');
module.exports = function (app) {
	
	let UsersLevel = app.sequelize.define('users_level', {
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
	}, {
		createdAt: false,
		updatedAt: false,
		deletedAt: false,
		freezeTableName: true,
		tableName: 'users_level'
	});

	return UsersLevel;
};
