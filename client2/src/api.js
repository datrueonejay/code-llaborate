"use strict";

const dburl = "http://localhost:3006";

function send(method, url, data, callback){
    var xhr = new XMLHttpRequest();
    xhr.onload = function() {
        if (xhr.status !== 200) callback("[" + xhr.status + "]" + xhr.responseText, null);
        else callback(null, (JSON.parse(xhr.responseText)));
    };
    url = dburl + url;
    xhr.open(method, url, true);
    if (!data) xhr.send();
    else{
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.send(JSON.stringify(data));
    }
}

exports.addUser = function(username, password, role, name, callback=null){
    send("POST", "/db/adduser/", {username: username, password: password, role:role, name:name}, callback);
};

exports.checkUser = function(username, password, callback=null){
    send("POST", "/db/checkuser/", {username: username, password: password }, callback);
};