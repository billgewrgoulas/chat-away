"use strict"
var roomIds = [];

const get = function() {
    return roomIds;
}

const put = function(ids) {
    roomIds = ids;
}

module.exports = {
    get,
    put
};