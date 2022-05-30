const Sequelize = require('sequelize');
const database = require('./init');
 
const paragraphSettings = database.define('paragraphSetting', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    pageId: {
        type: Sequelize.INTEGER,
        allowNull:false
    },
    fontSize: {
        type: Sequelize.INTEGER,
        
    },
    fontFamily: {
        type: Sequelize.STRING,
    },
    fontColor: {
        type: Sequelize.STRING,
    },
    
    
})
 
module.exports = paragraphSettings;