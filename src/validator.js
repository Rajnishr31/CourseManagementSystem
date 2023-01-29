// exports.valid = {name : function (name) {
//     return /^[a-zA-Z ]+$/.test(name);
// },

// email : function (email) {
//     return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,6})+$/.test(email);
// },

// password : function (password) {
//     return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,15}$/.test(password);
// }}

const axios = require('axios');

exports.isName = function(name) {
    return /^[a-zA-Z ]+$/.test(name);
}

exports.isEmail = function(email) {
    return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,6})+$/.test(email);
}

exports.isPassword = function(password) {
    return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,15}$/.test(password);
}

exports.isRole = function(role) {
    const roleArr = ["Employee", "Admin", "Super admin"];
    return roleArr.includes(role);
}

const isTitle = function(title) {
    return /^[A-Za-z]+\s*[A-Za-z0-9 -:',]{1,20}/.test(title);
}

exports.isDescription = function(description) {
    return /^[A-Za-z]+\s*[A-Za-z0-9 -:',]{1,}/.test(description);
}

exports.isVideoUrl = async function(videoUrl) {
    // let regex = /^https?:\/\/(.+\/)+.+(\.(mp4|mov|wmv|avi|avchd|flv|f4v|swf|mkv|webm|html5))$/.test(videoUrl);
    // if(!regex) return false;
    let isValid;
    await axios.get(videoUrl).then(() => { isValid = true }).catch(() => { isValid = false });
    if(!isValid) return false;
    return true;
}

exports.isTopics = function(topics){
    if(!topics && !topics.length) return "Empty";
    for(let i=0;i<topics.length;i++){
        if(!isTitle(topics[i])) return false;
    }
    return true;
}

module.exports.isTitle = isTitle;

// function x(videoUrl) {
//     if(!videoUrl || !videoUrl.length) return false;
//     for(let i=0;i<videoUrl.length;i++){
//         let regex = /^https?:\/\/(.+\/)+.+(\.(mp4|mov|wmv|avi|avchd|flv|f4v|swf|mkv|webm|html5))$/.test(videoUrl[i]);
//         if(!regex) return false;
//         // let isValid;
//         // await axios.get(videoUrl[i]).then(() => { isValid = true }).catch(() => { isValid = false });
//         // if(!isValid) return false;
//     }
//     return true;
// }

// console.log(x(""));