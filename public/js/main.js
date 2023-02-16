const chatForm = document.getElementById('chat-form');
const chatMessages = document.querySelector('.chat-messages');

const socket = io();

// Catch / Listen to 'message' event whenever emitted from the server
socket.on('message', message => {
    outputMessage(message);

    // Auto scroll down
    chatMessages.scrollTop = chatMessages.scrollHeight;
});

// When User Sends a Message
chatForm.addEventListener('submit', (e) =>{
    e.preventDefault();

    // Get message text
    const msg = e.target.elements.msg.value;

    // Emit our message to server
    socket.emit('chatMessage', msg);
});


// Output Mssage Function
function outputMessage(msg){
    const messageDiv = document.createElement('div');

    messageDiv.classList.add('message');
    messageDiv.innerHTML = `<p class="meta">Dave <span>11:02pm</span></p>
    <p class="text">
        ${msg}
    </p>`
    // Add message div to chat messages div
    document.querySelector('.chat-messages').appendChild(messageDiv);
}