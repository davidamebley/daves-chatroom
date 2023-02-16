const users = [];

// Add user to chat
function userJoin(id, username, room){
    const user = {id, username, room};

    users.push(user);

    return user;
}

// Get current user
function getCurrentUser(id){
    return users.find(user => user.id === id);
}

// User leaves chat
function userLeave(id){
    const index = users.findIndex(user => user.id === id);

    if (index !== -1) { //if we find index
        return users.splice(index, 1)[0];  //return the specific user that left
    }
}

// Get room users
function getRoomUsers(room){
    return users.filter(user => user.room === room);
}

module.exports = {
    userJoin,
    getCurrentUser,
    userLeave,
    getRoomUsers,
}