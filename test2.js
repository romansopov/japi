const japi = require("./index").japi
const req  = require("./index").req

const app = {
  "1.0.0": require("./appServer")
}

japi({
  name: "japi-test2",
  host: "127.0.0.1",
  port: 30001,
  app:  app
}, true).then(server => {
  let p1 = req("http://127.0.0.1:30000", {
    japi:   "1.0.0",
    method: "test",
    params: {
      test: 1
    }
  })
  let p2 = req("http://127.0.0.1:30000", {
    japi:   "1.0.1",
    method: "test",
    params: {
      test: 1
    }
  })
  let p3 = req("http://127.0.0.1:30000", {
    japi:   "1.0.0",
    method: "test2",
    params: {
      test: 1
    }
  })
  let p4 = req("http://127.0.0.1:30000", {
    japi:   "1.0.0",
    method: "test",
    params: {
      test: "2"
    }
  })
  let p5 = req("http://127.0.0.1:30000", {
    japi:   "1.0.0",
    method: "test",
    params: {
      test2: 1
    }
  })
  let f6 = () => {
    return new Promise(resolve => {
      
      var socket = require("socket.io-client")("ws://127.0.0.1:30000", {path: "/japi"})

      socket.on("connection", (data) => {
        if(data == "connection") {
          socket.emit("japi", {
            japi:   "1.0.0",
            method: "testFunc",
            params: {
              test: 10
            }
          }, (data) => {
            console.log("test2.js", data)
            socket.close()
          })
          socket.emit("japi", {data:"test2"}, (data) => { /*socket.close() resolve(data)*/ })
          socket.on("japi", (data) => {
            console.log("japi", data)
            //socket.close()
            if(data.data == "test2 +++") {
              socket.close()
              resolve(data)
            }
          })
        } else {
          resolve(false)
        }
      })
      
      socket.on("disconnect", () => {
        console.log("WS: disconnect")
      })
      
      //resolve(null)
    })
  }
  let p6 = f6()
  Promise.all([p1, p2, p3, p4, p5, p6]).then(values => {
    console.log(values)
    //console.log(server)
    server.close(() => {
      console.log("server is stopped")
      process.exit(0)
    })
  })
  
})

