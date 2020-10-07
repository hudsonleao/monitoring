let Sequelize = require('sequelize');
module.exports = function (app) {
	
	let UsersTelegram = app.sequelize.define('users_telegram', {
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
		bot_id: {
			type: Sequelize.STRING(255),
			allowNull: true
		},
		telegram_chat_id: {
			type: Sequelize.STRING(255),
			allowNull: false
		},
		message_success: {
			type: Sequelize.STRING(255),
			allowNull: false
		},
		message_error: {
			type: Sequelize.STRING(255),
			allowNull: false
        },
	}, {
		createdAt: false,
		updatedAt: false,
		deletedAt: false,
		freezeTableName: true,
		tableName: 'users_telegram'
	});

	return UsersTelegram;
};
