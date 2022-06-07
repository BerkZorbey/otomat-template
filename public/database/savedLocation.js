const Sequelize = require('sequelize');
const database = require('./init');
 
const savedLocation = database.define('location', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    savedPath: {
        type: Sequelize.STRING,
        unique:true
    }
    
    
})
 
module.exports = savedLocation;