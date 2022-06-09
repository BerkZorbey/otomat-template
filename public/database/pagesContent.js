const {Sequelize} = require('sequelize');
const path =require('path');
const database = require(path.join(__dirname,'.','init'));
 
const pagesContent = database.define('pages', {
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
    content: {
        type: Sequelize.TEXT,
        allowNull: false
    },
    
    
})
 
module.exports = pagesContent;