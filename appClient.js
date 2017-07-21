const _ = require("underscore")

module.exports = class {
  
  constructor() {
    this.appName = "App Client"
    this.testValue = 0
    this.testWsRs  = 0
    this.testWsRq  = 0
  }
  
  /**
   * Test Data response
   * @param data
   * @returns {Promise}
   */
  testData(data) {
    return new Promise((resolve, reject) => {
      if(!_.isUndefined(data.test)) {
        if(data.test == 1) {
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
    //console.log(this)
    this.testWsRs++
    return new Promise((resolve, reject) => {
      if(!_.isUndefined(data.test)) {
        if(data.test != 0) {
          this.testValue = data.test
        }
        //console.log(this)
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
      //console.log("testFunc app", ws)
      //console.log("testFunc", this)
      
      if(ws != null) {
        console.log("[CLIENT] wsRes app", this)
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
  
  setTestValue(rq, rs) {
    this.testWsRs = rs
    this.testWsRq = rq
    return this
  }
  
}
