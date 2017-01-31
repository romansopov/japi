const _ = require('underscore');

module.exports = {
  test: (data) => {
    return new Promise((resolve, reject) => {
      if(!_.isUndefined(data.test)) {
        if(data.test == 1) {
          resolve(true);
        } else {
          reject({
            code: 100,
            message: 'Validation Error: option "test" not equal 1'
          });
        }
      }
      if(_.isUndefined(data.test)) {
        reject({
          code: 100,
          message: 'Validation Error: option "test" is undefined'
        });
      }
    });
  }
};