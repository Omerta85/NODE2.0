const removeOldTokens = require('./removeOldTokens');
const removeOldPassword = require('./removeOldPasswords');

const cronRunner = () =>{
    removeOldTokens.start();
    removeOldPassword.start();
};

module.exports ={
    cronRunner
};