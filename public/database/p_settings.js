const Sequelize = require('sequelize');
const database = require('./init');
 
const paragraph_setting = database.define('p_settings', {
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
 
module.exports = paragraph_setting;