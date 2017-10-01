var express = require('express')
var socketIO = require('socket.io')
const path = require('path')
var http = require('http')
var expressServer = express()
expressServer.use(express.static(path.join(__dirname,'public')))
var client_server = http.createServer(expressServer)
var io = socketIO(client_server)
const notif_sockets = []
io.of('notification_room').on('connection',(socket)=>{
    console.log("connected to server")
    socket.on('notification',(data)=>{
        console.log(data.message)
        notif_sockets.forEach((sock)=>{
            sock.emit('show_notif',{message:data.message})
        })
    })
    socket.on('notif_client',()=>{
        notif_sockets.push(socket)
    })
})
client_server.listen(8000)
