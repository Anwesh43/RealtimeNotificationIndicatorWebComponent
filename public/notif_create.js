const textArea = document.getElementById('text_area')
const postButton = document.getElementById('post')
socket = io.connect('/notification_room')
postButton.onclick = () => {
    socket.emit('notification',{message:textArea.value})
}
