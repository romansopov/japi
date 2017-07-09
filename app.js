const _ = require("underscore")

module.exports = class App {
  
  constructor(name) {
    this.name = name
    this.testValue = 1
  }
  
  test(data) {
    return new Promise((resolve, reject) => {
      console.log(this)
      if (!_.isUndefined(data.test)) {
        if (data.test == 1) {
          resolve(true)
        } else {
          reject({
            code: 100,
            message: 'Validation Error: option "test" not equal 1'
          });
        }
      }
      if (_.isUndefined(data.test)) {
        reject({
          code: 100,
          message: 'Validation Error: option "test" is undefined'
        })
      }
    })
  }
  
}