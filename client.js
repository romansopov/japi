const JAPI_HOST = "127.0.0.1"
const JAPI_POST = "30000"

const debug = require("debug")("japi:client")
const japi  = require("./index").japi
const AppClient = require("./appClient")
const clientApp = { "1.0.0": AppClient } // Allowed client (local) API

// Client connection
const japiClient1 = require("./index").client(clientApp, JAPI_HOST, JAPI_POST)       // POST
const japiClient2 = require("./index").client(clientApp, JAPI_HOST, JAPI_POST, true) // WS 1
const japiClient3 = require("./index").client(clientApp, JAPI_HOST, JAPI_POST, true) // WS 2
const japiClient4 = require("./index").client(clientApp, JAPI_HOST, JAPI_POST, true) // WS 3

japiClient1.then(client => {
  console.log("client1", typeof client)
})

japiClient2.then(client => {
  console.log("client2", typeof client)
})

japiClient3.then(client => {
  console.log("client3", typeof client)
})

japiClient4.then(client => {
  console.log("client4", typeof client)
})
