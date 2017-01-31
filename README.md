# Спецификация JAPI

JAPI - микросервис и протокол обмена данными между клиентом и сервером на основе формата JSON.

Данные в формате JSON (метод POST) передаются в едину точку (хост) обработки запросов микросервиса, 
например: http://127.0.0.1:30000, после обработки запроса возвращается ответ в формате JSON.

## Объект запроса

### japi

Версия JAPI приложения.

### app

Объект приложения.

```js
let app = {
  '1.0.0': {
    getUser: () => {
      // Funtion
    }
  }
}
```

### method

Вызываемый метод API.

```js
let japi = {
  japi: "1.0.0",
  method: "getUser",
  app: app
}
```

Вызывает метод ``getUser`` версии ``1.0.0``

### params

Параметры запроса: **object**, **array**, **null** или может отсуствовать если запрос без параметров.

## Объект ответа

### Ошибки

 - 1 - Option "japi" or "method" is not set
 - 2 - Object not found
 - 3 - Method not found
 - 4 - Validation error
 - \> 99 - Application error

При ```success:true``` может присутствовать ```result```, при ```success:false``` обязательным будет присутствие ```error```

```json
{
  "success": true,
  "result": [{
    "uid": 5,
    "name": "Roman Sopov",
    "email": "roman@sopov.net"
  }]
}
```

```json
{
  "success": false,
  "error": {
    "code": 100,
    "message": "Ошибка в параметрах запроса"
  }
}
```

## Пример

```js
const _japi = require('node-japi');
const japi = _japi.japi;
const req  = _japi.req;

const app = {
  '1.0.0': require('./app')
};

japi({
  name: 'japi-test',
  host: '127.0.0.1',
  port: 30000,
  app:  app
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
    /* console.log(values);
    [ 
      { success: true, result: true },
      { success: false, error: { code: 2, message: 'Object not found' } },
      { success: false, error: { code: 3, message: 'Method not found' } },
      { success: false, error: { code: 100, message: 'Validation Error: option "test" not equal 1' } },
      { success: false, error: { code: 100, message: 'Validation Error: option "test" is undefined' } } 
    ]
    */
    server.close();
  });
  
});


```

## Используемая документация

http://json.org/  
http://jsonapi.org/  
http://jsonrpc.org/
