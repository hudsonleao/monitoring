let Sequelize = require('sequelize');
module.exports = function (app) {
	
	let Servers = app.sequelize.define('servers', {
		id: {
			type: Sequelize.INTEGER,
			autoIncrement: true,
			primaryKey: true,
			allowNull: false
		},
		description: {
			type: Sequelize.STRING(255),
			allowNull: false
		},
		ip: {
			type: Sequelize.STRING(255),
			allowNull: false
        },
        key_ssh: {
			type: Sequelize.STRING(500),
			allowNull: false
		},
	}, {

		createdAt: false,
		updatedAt: false,
		deletedAt: false,
		freezeTableName: true,
		tableName: 'servers'
	});

	return Servers;
};
