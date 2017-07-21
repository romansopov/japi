const JAPI_HOST = "127.0.0.1"
const JAPI_POST = "30000"

const debug = require("debug")("japi:server")
const japi  = require("./index").japi

const AppServer = require("./appServer")
const serverApp = { "1.0.0": AppServer } // Allowed server API

let Server = null
let Socket = null

/**
 * JAPI Server run
 */
japi(serverApp, "JAPI Server", JAPI_HOST, JAPI_POST, true).then(server => {
  
  Server = server.server
  Socket = server.socket
  
  console.log("Server:", typeof Server)
  console.log("Socket:", typeof Socket)
  
  setInterval(() => {
    
    console.log("Socket.sockets.sockets", Socket.sockets.sockets)
    console.log("Socket.sockets.connected", Socket.sockets.connected)
    
    Socket.emit("ping", "[JAPI Server]: Ping " + new Date().toISOString())
  }, 10000)
  
  
})
