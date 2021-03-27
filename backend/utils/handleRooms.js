var rooms = []

const addUser = function(id) {
    if (rooms.includes(id)) {
        return;
    }
    rooms.push(id);
}

const deleteUser = function(id) {
    for (let i = 0; i < rooms.length; i++) {
        if (rooms[i] == id) {
            rooms.splice(i, 1);
        }
    }
}

const getRooms = function() {
    return rooms;
}

const online = function(id) {
    console.log(rooms);
    for (let i = 0; i < rooms.length; i++) {
        if (rooms[i] == id) {
            return true;
        }
    }
    return false;
}

module.exports = {
    addUser,
    deleteUser,
    getRooms,
    online
}