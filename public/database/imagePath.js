const {Sequelize} = require('sequelize');
const path =require('path');
const database = require(path.join(__dirname,'.','init'));
 
const imagePath = database.define('images', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    pageName: {
        type: Sequelize.STRING,
        allowNull: false
    },
    tag: {
        type: Sequelize.STRING,
        allowNull: false
    },
    image:{
        type: Sequelize.STRING,
    }
    
    
})
 
module.exports = imagePath;