const {Sequelize} = require('sequelize');
const path =require('path');
const database = require(path.join(__dirname,'.','init'));
 
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