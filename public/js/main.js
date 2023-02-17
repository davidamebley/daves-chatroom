const chatForm = document.getElementById('chat-form');
const chatMessages = document.querySelector('.chat-messages');
const roomNameElement = document.getElementById('room-name');
const userListElement = document.getElementById('users');
const messageFieldElement = document.getElementById('msg');
const typingStatusElement = document.getElementById('typing-status');
let typingTimerId;

// Get username and chatroom category from query string. We use the QS library cdn
const { username, room } = Qs.parse(location.search, {
    ignoreQueryPrefix: true
});


const socket = io();

//Join chatroom
socket.emit('joinRoom', {username, room});

// Get room and users info
socket.on('roomUsers', ({ room, users }) =>{
    outputRoomName(room);
    outputUsersList(users);
});


// Catch / Listen to 'message' event whenever emitted from the server
socket.on('message', message => {
    outputMessage(message);
    // console.log(message);

    // Auto scroll down
    chatMessages.scrollTop = chatMessages.scrollHeight;
});

// Listen for typing event broadcast from server
socket.on('userTypingBroadcast', (username)=>{
    typingStatusElement.innerHTML = `<i>${username} Typing...</i>`
    console.log('typing Broadcast')
});

// Listen for typing event broadcast from server
socket.on('userStoppedTypingBroadcast', ()=>{
    typingStatusElement.innerHTML = '';
});

// When User Sends a Message
chatForm.addEventListener('submit', (e) =>{
    e.preventDefault();

    // Get message text
    const msg = e.target.elements.msg.value;

    // Emit our messages to server
    socket.emit('chatMessage', msg);

    //CLear message text field and focus
    e.target.elements.msg.value = '';
    e.target.elements.msg.focus();
});

//Listen to Typing event
messageFieldElement.addEventListener('input', (event) => {
  socket.emit('userTyping');

  clearTimeout(typingTimerId);  //cancel timeout as user keeps typing
  typingTimerId = setTimeout(() => {
    // User stopped typing
    socket.emit('userStoppedTyping'); //trigger timeout when user stops typing for a while
  }, 500);

});



// Output Mssage Function
function outputMessage(msg){
    const messageDiv = document.createElement('div');

    messageDiv.classList.add('message');
    messageDiv.innerHTML = `<p class="meta">${msg.username} <span>${msg.time}</span></p>
    <p class="text">
        ${msg.text}
    </p>`
    // Add message div to chat messages div
    document.querySelector('.chat-messages').appendChild(messageDiv);
}

//Output room info FUnction
function outputRoomName(room){
    roomNameElement.innerText = room;
}

//Output users list function
function outputUsersList(users){
    userListElement.innerHTML = `
        ${users.map(user => `<li>${user.username}</li>`).join('')}
    `;
}