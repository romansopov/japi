const japi = require('./index').japi;
const req  = require('./index').req;
const app  = require('./app')

const App = {
  '1.0.0': new app("1.0.0")
}

japi({
  name: 'japi-test',
  host: '127.0.0.1',
  port: 30000,
  app:  App
}).then(server => {
  let p1 = req('http://127.0.0.1:30000', {
    japi:   "1.0.0",
    method: "test",
    params: {
      test: 1
    }
  });
  let p2 = req('http://127.0.0.1:30000', {
    japi:   "1.0.1",
    method: "test",
    params: {
      test: 1
    }
  });
  let p3 = req('http://127.0.0.1:30000', {
    japi:   "1.0.0",
    method: "test2",
    params: {
      test: 1
    }
  });
  let p4 = req('http://127.0.0.1:30000', {
    japi:   "1.0.0",
    method: "test",
    params: {
      test: '2'
    }
  });
  let p5 = req('http://127.0.0.1:30000', {
    japi:   "1.0.0",
    method: "test",
    params: {
      test2: 1
    }
  });

  Promise.all([p1, p2, p3, p4, p5]).then(values => {
    console.log(values);
    server.close();
  });
  
});

