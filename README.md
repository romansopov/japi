# JAPI 1.0 Specification

Modern JSON-RPC API

## Объект запроса

### japi

A String specifying the version of the JAPI protocol.

### method

A String containing the name of the contreller and the method.

### params

A Structured value that holds the parameter values to be used during the invocation of the method. This member MAY be omitted.

### sign

Электронная подпись хэша всех переданных параметров

```json
{
  "japi": "1.0",
  "method": "users.get",
  "params": [{
    "uid": "5"
  }],
  "id": 1,
  "token": "authentication token",
  "sign": {
    "val": "e10adc3949ba59abbe56e057f20f883e",
    "alg": "rsa"
  }
}
```

## Объект ответа

### Ошибки

 - 10000 - Ошибки при разборе запроса
 - 20000 - Ошибки при валидации праметров
 - 30000 - Ошибки логики приложения
 - 40000 - Ошибки сервера приложения
 - 50000 - Неизвестные

```json
{
  "japi": "1.0",
  "success": true,
  "result": [{
    "uid": 5,
    "name": "Roman Sopov",
    "email": "roman@sopov.net"
  }],
  "id": 1,
  "token": "new authentication token"
}
```

```json
{
  "japi": "1.0",
  "success": false,
  "error": {
    "code": 100,
    "message": "Invalid Request"
  }
}
```
