# Спецификация протокола JAPI

## Объект запроса

### japi

Версия протокола в системе.

### method

Вызываемый метод API.

- "method": "function" --> function();
- "method": "function.function" --> function.function();

### params

Параметры запроса. Массив с объектами, может отсуствовать если запрос без параметров.

### id

Идентификатор запроса для идентификации ответа.

### sign

Электронная подпись хэша всех переданных параметров. 

Для вычисления хэша, все параметры сортируются в алфавитном порядке и склеиваются в одну строку, из полученной строки вычесляется хэш.

```
param1:value1:param2:value2:param3:value3
```

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
