const _ = require("underscore")

module.exports = class {
  
  constructor() {
    this.appServer  = null
    this.appSocket  = null
    this.appName    = "App Server"
    
    this.testValue = 0
    this.testWsRs  = 0
    this.testWsRq  = 0
    
    console.log("appServer.js constructor")
    
  }
  
  /**
   * Test Data response
   * @param data
   * @returns {Promise}
   */
  testData(data) {
    console.log("appServer.js testData:", this)
    return new Promise((resolve, reject) => {
      if(!_.isUndefined(data.test)) {
        //this.testValue = data.test
        //resolve(true)
        
        if(data.test != 0) {
          this.testValue = data.test
          resolve(true)
        } else {
          reject({
            code: 100,
            message: "Validation Error: option \"test\" not equal 1"
          })
        }
        
      }
      if(_.isUndefined(data.test)) {
        reject({
          code: 100,
          message: "Validation Error: option \"test\" is undefined"
        })
      }
    })
  }
  
  testData2(data) {
    console.log(this)
    return new Promise((resolve, reject) => {
      if(!_.isUndefined(data.test)) {
        if(data.test != 0) {
          this.testValue = data.test
        }
        resolve(this.testValue)
      }
      if(_.isUndefined(data.test)) {
        reject({
          code: 100,
          message: "Validation Error: option \"test\" is undefined"
        })
      }
    })
  }
  
  /**
   * Test Func response
   * @param data
   * @returns {Promise}
   */
  testFunc(data, res, ws) {
    return new Promise((resolve, reject) => {
      
      //console.log("appServer.js [testFunc ws]", ws)
      
      
      
      //console.log("testFunc", this)
      
      if(ws != null) {
        //console.log("[SERVER] testFunc (WS)", this)
      }
      
      if(!_.isUndefined(data.test)) {
        
        if(ws) {
          
          ws.emit("japi", {
            success: true,
            result: {
              japi: "1.0.0",
              method: "testData2",
              params: {
                test: data.test
              }
            }
          }) // <- Send result to WS
          
        }
        
        resolve({
          japi: "1.0.0",
          method: "testData2",
          params: {
            test: data.test
          }
        })
      }
      if(_.isUndefined(data.test)) {
        reject({
          code: 100,
          message: "Validation Error: option \"test\" is undefined"
        })
      }
    })
  }
  
  testWSFunc(data, res, ws) {
    return new Promise((resolve, reject) => {
    
    })
  }
  
  setTestValue(rq, rs) {
    this.testWsRs = rs
    this.testWsRq = rq
  }
  
}
