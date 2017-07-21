const http    = require("http")
const _       = require("underscore")
const express = require("express")()
const server  = require("http").createServer(express)
const redis   = require("redis")
const redisWS = require("socket.io-redis")
const body    = require("body-parser")
const request = require("request")
const uuid    = require("node-uuid")
const debug   = require("debug")("node-japi")

// WS
let socketServer = null
let socketClient = null
let socketClientCount = 0
let socketClientIDs   = []

// Redis client for session
let redisClient = null

// Options/App
let App = null

/**
 *
 * @param app
 * @param name
 * @param host
 * @param port
 * @param redisEnable
 * @param redisHost
 * @param redisPort
 * @returns {Promise}
 */
let japi = (
  app,
  name = "JAPI Server",
  host = "localhost",
  port = "30000",
  redisEnable = false,
  redisHost = "localhost",
  redisPort = 6379
) => {
  console.log("[JAPI] app type", typeof app)
  return new Promise((resolve, reject) => {
    
    socketEnable(redisEnable, redisHost, redisPort).then(socket => {
  
      App = app
  
      // Run App
      express.use(body.json())
  
      // JAPI GET
      express.get("/japi", (req, res) => {
        // TODO
      })
      
      // JAPI POST
      express.post("/japi", (req, res) => {
        exec(req.body, App, res).then(result => {
          res.json(result)
        })
      })
      
      server.listen(port, host, 511, () => {
  
        //console.log(server)
        //console.log(socket)
  
        resolve({server, socket})
        //reject(null)
      })
    })
    
  })
  
}

/**
 * Execute JAPI
 * @param japi
 * @param app
 * @param serverResponse
 * @param socketClient
 * @returns {Promise}
 */
let exec = (japi, app, serverResponse = null, socketClient = null) => {
  return new Promise(resolve => {
    let result = new Promise(resolve => {
      if(_.isString(japi.japi)) {
        if(_.isString(japi.method)) {
          
          if(_.isFunction(app[japi.japi])) {
            
            // Create new App Object
            let App = new app[japi.japi]
            
            if(_.isFunction(App[japi.method])) {
              if (_.isArray(japi.params) || _.isObject(japi.params)) {
                App[japi.method](japi.params, serverResponse, socketClient).then(result => {
                  resolve({
                    success: true,
                    result: result
                  })
                }, error => {
                  resolve({
                    success: false,
                    error: error
                  })
                })
              }
              else if (_.isNull(japi.params) || _.isUndefined(japi.params)) {
                App[japi.method](null, serverResponse, socketClient).then(result => {
                  resolve({
                    success: true,
                    result: result
                  })
                }, error => {
                  resolve({
                    success: false,
                    error: error
                  })
                })
              }
            } else {
              resolve({
                success: false,
                error: {
                  code: 3,
                  message: "Method not found"
                }
              })
            }
          } else {
            resolve({
              success: false,
              error: {
                code: 2,
                message: "Object not found"
              }
            })
          }
        } else {
          // param method
          resolve({
            success: false,
            error: {
              code: 1,
              message: "Option \"method\" is not set"
            }
          })
        }
      } else {
        resolve({
          success: false,
          error: {
            code: 1,
            message: "Option \"japi\" is not set"
          }
        })
      }
    })
    
    result.then(result => {
      resolve(result)
    })
    
  })
  
}

/**
 * JAPI Request (POST)
 * @param host
 * @param data
 * @param app
 * @returns {Promise}
 */
let req = (host, data, app) => {
  return new Promise((resolve, reject) => {
    request({
      url:    host,
      method: "POST",
      json:   true,
      body:   data
    }, (error, response, body) => {
      if(error == null) {
        /**
         * Result JAPI Function
         */
        if(typeof body.result === "object" && typeof app === "object") {
          if(typeof body.result.japi === "string") {
            exec(body.result, app).then(result => {
              console.log("Exec Client Function", body.result)
              resolve(result)
            })
          } else {
            resolve(body)
          }
        } else {
          resolve(body)
        }
      } else {
        reject(error)
      }
    })
  })
}

/**
 * Enable WS and Redis
 * @param wsEnable
 * @param wsPath
 * @param redisEnable
 * @param redisHost
 * @param redisPort
 * @returns {Promise}
 */
let socketEnable = (redisEnable = false, redisHost = "localhost", redisPort = 6379) => {
  return new Promise(resolve => {
    // WebSocket
    socketServer = require("socket.io")(server, {path: "/japi"})
      
    //debug("opts %O", opts)
      
    // Enable Redis session adapter and Redis client
    if (redisEnable) {
      redisClient = redis.createClient({host: redisHost, port: redisPort})
      socketServer.adapter(redisWS({host: redisHost, port: redisPort}))
    }
  
    let japiCount = 0
      
    socketServer.engine.generateId = (req) => {
      return uuid.v4()
    }
      
    // Runtime WS
    socketServer.on("connection", (client) => {
        
      //console.log("Before socketClient", typeof socketClient)
      
      //console.log("After socketClient", socketClient.id)
        
      socketClientIDs.push(client.id)
        
      client.emit("connection", "connection") // <- Signal
        
      socketClientCount++
  
      console.log("[WS] /connection", socketClientCount)
        
      //console.log("Server WS connect:", socketClientCount)
      //console.log("Server WS connect:", socketClient.id)
      //console.log("Server WS connect:", socketClientIDs)
        
      // Middleware
      client.use((packet, next) => {
        console.log("[WS] Middleware")
        next()
      })
      /*
        setInterval(()=> {
          console.log("PING SERVER", socketClientIDs)
          client.to(client.id).emit("ping", socketClientIDs)
        }, 1000)
        */
        
      if(socketClient != client.id) {
        client.broadcast.emit("ping", "New client: "+client.id)
      }
  
      let si = setInterval(()=> {
        for(let id of socketClientIDs) {
          console.log(client.id + " >>> " + id)
        }
      }, 1000)
        
        
      /*
        client.broadcast.emit("ping", "1 new client: "+client.id)
        client.emit("ping", "2 new client: "+client.id)
        */
        
      socketClient = client.id
        
      /**
         * JAPI Web socket listener
         */
      client.on("japi", (japi, cb) => {
  
        //socketClientCount++
        console.log("[WS] /japi", japiCount++)
          
        //console.log(client.id, cnt++, japi)
          
        exec(japi, App, null, client).then(result => {
          //client.emit("japi", result) // <- Send result to WS
          cb(result) // <- Response result to callback
        })
        //socketServer.to(client.id).emit("japi", {data: japi.data + " +++"})
      })
  
      client.on("disconnect", () => {
        console.log("disconnect")
        clearInterval(si)
      })
        
    })
  
    resolve(socketServer)
      

  })
}

/**
 * JAPI Client
 * @param app
 * @param host
 * @param port
 * @param socket
 */
let client = (app, host = "127.0.0.1", port = "30000", socket = false) => {
  
  return new Promise((resolve, reject) => {
    
    let socketEnable = () => {
      return new Promise((resolve) => {
        if(socket) {
          const socketClient = require("socket.io-client")("ws://" + host + ":" + port, {path: "/japi"})
          
          socketClient.on("connection", (data) => {
            if(data == "connection") {
              
              console.log("[JAPI Client]: Connect:", socketClient.id)
  
              // Allow listen on only JAPI (Exec Client Function)
              socketClient.on("japi", (data) => {
                if(typeof data.result === "object") {
                  if(typeof data.result.japi === "string") {
                    exec(data.result, app).then(result => {
                      console.log("[JAPI Client]: Exec: " + data.result.method, result, app)
                      //resolve(result)
                    })
                  } else {
                    //resolve(body)
                    console.info("[JAPI Client]: Response not JAPI", data)
                  }
                } else {
                  console.info("[JAPI Client]: Response not JAPI", data)
                }
              })
  
              /**
               * JAPI Ping
               */
              socketClient.on("ping", (data) => {
                if(typeof data !== "undefined") {
                  console.log("[JAPI Client "+ socketClient.id + "]:", data)
                }
              })
              
              socketClient.on("disconnect", () => {
                console.log("[JAPI Client]: Disconnect")
                socket = false
              })
              
              resolve(socketClient)
            } else {
              resolve(false)
            }
          })
          
        } else {
          resolve(false)
        }
      })
    }
  
    let client = function(japi, type = null) {
      return new Promise((resolve, reject) => {
      
        if (type == null && typeof socket === "object") {
          type = "socket"
        }
        else if (type == null && socket == false) {
          type = "post"
        }
        else if(type == "get") {
          // TODO
        } else {
          reject("Error request type: " + type)
        }
        
        /**
         * POST
         */
        if(type == "post") {
          //console.log("POST")
          request({
            url: "http://" + host + ":" + port,
            method: "POST",
            json: true,
            body: japi
          }, (error, response, body) => {
            if (error == null) {
              /**
               * Result JAPI Function
               */
              if (typeof body.result === "object") {
                if (typeof body.result.japi === "string") {
                  exec(body.result, app).then(result => {
                    //console.log("[POST] Exec Client Function", result)
                    console.log("[JAPI Client]: Exec: " + body.result.method, result, app)
                    resolve(result)
                  })
                } else {
                  resolve(body)
                }
              } else {
                resolve(body)
              }
            } else {
              reject(error)
            }
          })
        }
        
        /**
         * SOCKET
         */
        if(type == "socket") {
          socket.emit("japi", japi, data => {
            if(data.success == true && typeof data.result === "object") {
              if(typeof data.result.japi === "string") {
                exec(data.result, app).then(result => {
                  //console.log("[WS] Exec Client Function", result)
                  resolve(result)
                })
                //console.log("SOCKET RESPONSE", data)
              }
            } else {
              resolve(data)
            }
          })
        }
        
      })
    }
    
    socketEnable().then(result => {
      socket = result
      
      resolve(client)
      
    }, error => {
      reject(error)
    })
    
  })
  
}

module.exports.japi = japi
module.exports.req = req
module.exports.client = client
