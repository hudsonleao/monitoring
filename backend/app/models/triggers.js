let Sequelize = require('sequelize');
module.exports = function (app) {
	
	let Triggers = app.sequelize.define('triggers', {
		id: {
			type: Sequelize.INTEGER,
			autoIncrement: true,
			primaryKey: true,
			allowNull: false
        },
        users_id: {
            type: Sequelize.INTEGER,
            allowNull: false,
            references: {
                model: 'users',
                key: 'id'
            }
        },
		name: {
			type: Sequelize.STRING(255),
			allowNull: false
        },
        command: {
            type: Sequelize.STRING,
			allowNull: false
        }
	}, {
		createdAt: false,
		updatedAt: false,
		deletedAt: false,
		freezeTableName: true,
		tableName: 'triggers'
	});

	return Triggers;
};
