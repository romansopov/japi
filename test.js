const JAPI_HOST = "127.0.0.1"
const JAPI_POST = "30000"

const test  = require("ava")
const debug = require("debug")("app:test")
const japi  = require("./index").japi
const AppClient = require("./appClient")
const AppServer = require("./appServer")
const serverApp = { "1.0.0": AppServer } // Allowed server API
const clientApp = { "1.0.0": AppClient } // Allowed client (local) API

// Client connection
const japiClient1 = require("./index").client(JAPI_HOST, JAPI_POST, clientApp)       // POST
const japiClient2 = require("./index").client(JAPI_HOST, JAPI_POST, clientApp, true) // WS
const japiClient3 = require("./index").client(JAPI_HOST, JAPI_POST, clientApp)       // POST 2
const japiClient4 = require("./index").client(JAPI_HOST, JAPI_POST, clientApp, true) // WS 2

/**
 * JAPI Server
 */
let server, client1, client2, client3, client4

/**
 * Server
 */
test.before("Server", async t => {
  server = await japi(serverApp, "JAPI Server", "localhost", "30000", true)
  client1 = await japiClient1
  client2 = await japiClient2
  client3 = await japiClient3
  client4 = await japiClient4
  
  t.is(server.domain, null)
  t.is(typeof client1, "function")
  t.is(typeof client2, "function")
  t.is(typeof client3, "function")
  t.is(typeof client4, "function")
})

/**
 * POST: Result true
 */
test("POST: Result true", async t => {
  let result1 = await client1({
    japi:   "1.0.0",
    method: "testData",
    params: {
      test: 2
    }
  })
  let result2 = await client3({
    japi:   "1.0.0",
    method: "testData",
    params: {
      test: 2
    }
  })
  console.log(result2)
  t.true(result1.success)
  t.true(result1.result)
  
})

/**
 * POST: Object not found
 */
test("POST: Object not found", async t => {
  let result = await client1({
    japi:   "1.0.1",
    method: "testData",
    params: {
      test: 1
    }
  })
  t.false(result.success)
  t.is(result.error.code, 2)
  t.is(result.error.message, "Object not found")
})

/**
 * POST: Method not found
 */
test("POST: Method not found", async t => {
  let result = await client1({
    japi:   "1.0.0",
    method: "testFake",
    params: {
      test: 1
    }
  })
  t.false(result.success)
  t.is(result.error.code, 3)
  t.is(result.error.message, "Method not found")
})

/**
 * POST: Validation Error: option "test" not equal 1
 */
test("POST: Validation Error: option \"test\" not equal 1", async t => {
  let result = await client1({
    japi:   "1.0.0",
    method: "testData",
    params: {
      test: 0
    }
  })
  t.false(result.success)
  t.is(result.error.code, 100)
  t.is(result.error.message, "Validation Error: option \"test\" not equal 1")
})

/**
 * POST: Validation Error: option \"test\" is undefined
 */
test("POST: Validation Error: option \"test\" is undefined", async t => {
  let result = await client1({
    japi:   "1.0.0",
    method: "testData",
    params: {
      test2: 1
    }
  })
  t.false(result.success)
  t.is(result.error.code, 100)
  t.is(result.error.message, "Validation Error: option \"test\" is undefined")
})

/**
 * POST: Func 1
 */

test("POST: Func 1", async t => {
  let result = await client1({
    japi:   "1.0.0",
    method: "testFunc",
    params: {
      test: 1
    }
  })
  t.true(result.success)
  t.is(result.result, 1)
})

/**
 * POST: Func 2
 */
test("POST: Func 2", async t => {
  let result = await client1({
    japi:   "1.0.0",
    method: "testFunc",
    params: {
      test: 2
    }
  })
  t.true(result.success)
  t.is(result.result, 2)
})

/**
 * POST: Func 3
 */
test("POST: Func 3", async t => {
  let result = await client1({
    japi:   "1.0.0",
    method: "testFunc",
    params: {
      test: 0
    }
  })
  t.true(result.success)
  t.is(result.result, 0)
})

test("WS: Func 1", async t => {
  let result = await client2({
    japi:   "1.0.0",
    method: "testFunc",
    params: {
      test: 1
    }
  })
  t.true(result.success)
  t.is(result.result, 1)
})
test("WS: Func 2", async t => {
  let result = await client2({
    japi:   "1.0.0",
    method: "testFunc",
    params: {
      test: 2
    }
  })
  t.true(result.success)
  t.is(result.result, 2)
})
test("WS: Func 3", async t => {
  let result = await client2({
    japi:   "1.0.0",
    method: "testFunc",
    params: {
      test: 0
    }
  })
  t.true(result.success)
  t.is(result.result, 0)
})

/**
 * WS: 10000 rq
 */
/*
test("WS: 10000 rq", async t => {
  return new Promise(resolve => {
    let rq = 10000
    let socket = require("socket.io-client")("ws://127.0.0.1:30000", {path: "/japi"})
    
    socket.on("connection", (data) => {
      
      t.is(data, "connection")
      
      for(let i = 1; i <= rq; i++) {
        socket.emit("japi", {data: i}, (data) => {
          t.true(data.result)
        })
      }
      
      let iRes = 1
      socket.on("japi", (data) => {
        if (iRes == rq && data.data == rq) {
          socket.close()
          resolve(true)
        }
        iRes++
      })
    })
    
    socket.on("disconnect", () => {
      t.pass()
    })
    
  })
})
*/
/**
 * WS: 100000 rq
 */
/*
test("WS: 100000 rq", async t => {
  return new Promise(resolve => {
    let rq = 100000
    let socket = require("socket.io-client")("ws://127.0.0.1:30000", {path: "/japi"})
    
    socket.on("connection", (data) => {
      
      t.is(data, "connection")
      
      for(let i = 1; i <= rq; i++) {
        socket.emit("japi", {data: i}, (data) => {
          t.true(data.result)
        })
      }
      
      let iRes = 1
      socket.on("japi", (data) => {
        if (iRes == rq && data.data == rq) {
          socket.close()
          resolve(true)
        }
        iRes++
      })
    })
    
    socket.on("disconnect", () => {
      t.pass()
    })
    
  })
})
*/

/**
 * END
 */
test.after("cleanup", t => {
  t.pass()
  /*
  server.close(() => {
    t.pass()
  })
  */
})
