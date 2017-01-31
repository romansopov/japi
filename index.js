const _       = require('underscore');
const http    = require('http');
const express = require('express')();
const body    = require('body-parser');
const request = require('request');

/**
 * JAPI
 * @param config
 * @returns {Promise}
 */
let japi = (config) => {
  return new Promise((resolve, reject) => {
    // Run App
    express.use(body.json());
    express.post('/', (req, res) => {
      //console.log('japi body: ', req.body);
      if(_.isString(req.body.japi)) {
        //console.log('japi ver: ', req.body.japi);
        if(_.isString(req.body.method)) {
          //console.log('japi method: ', req.body.method);
          if(_.isObject(config.app[req.body.japi])) {
            //console.log('japi object: ', config.app[req.body.japi]);
            if(_.isFunction(config.app[req.body.japi][req.body.method])) {
              //console.log('japi function: ', config.app[req.body.japi][req.body.method]);
              if (_.isArray(req.body.params) || _.isObject(req.body.params)) {
                config.app[req.body.japi][req.body.method](req.body.params).then(result => {
                  res.json({
                    success: true,
                    result: result
                  });
                }, error => {
                  res.json({
                    success: false,
                    error: error
                  });
                });
              }
              else if (_.isNull(req.body.params) || _.isUndefined(req.body.params)) {
                config.app[req.body.japi][req.body.method].then(result => {
                  res.json({
                    success: true,
                    result: result
                  });
                }, error => {
                  res.json({
                    success: false,
                    error: error
                  });
                });
              }
            } else {
              res.json({
                success: false,
                error: {
                  code: 3,
                  message: 'Method not found'
                }
              });
            }
          } else {
            res.json({
              success: false,
              error: {
                code: 2,
                message: 'Object not found'
              }
            });
          }
        } else {
          // param method
          res.json({
            success: false,
            error: {
              code: 1,
              message: 'Option "method" is not set'
            }
          });
        }
      } else {
        res.json({
          success: false,
          error: {
            code: 1,
            message: 'Option "japi" is not set'
          }
        });
      }
    });

    // Create Server
    const server = http.createServer(express).listen(config.port, config.host, 511, () => {
      resolve(server);
    });

  });
};

/**
 * JAPI Request
 * @param host
 * @param data
 * @returns {Promise}
 */
let req = (host, data) => {
  return new Promise((resolve, reject) => {
    request({
      url:    url,
      method: 'POST',
      json:   true,
      body:   data
    }, (error, response, body) => {
      if(error == null) {
        resolve(body);
      } else {
        reject(error);
      }
    });
  });
};

module.exports.japi = japi;
module.exports.req = req;



