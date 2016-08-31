# Спецификация протокола JAPI

JAPI - это простой протокол обмена данными между клиентом и сервером на основе формата JSON.

Схема взаимодействия: Data -> Method -> Data. 

Данные в формате JSON (метод POST) передаются в едину точку обработки запросов, например: /japi/, а после обработки запроса возвращается ответ, тоже в формате JSON.

## Объект запроса

### japi

Версия протокола вашего приложения.

### method

Вызываемый метод API.

```"method": "info"```

Вызывает метод объекта приложения: app.info();

```"method": "users.get"```

Вызывает метод объекта подключенного модуля: users.get();

При подключении модуля JAPI, первым и единственным параметром передается главный объект приложения ``app``. Объект приложение может содержать объекты БД, логирования и т.п.

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
  "japi": "1.0.0",
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
 - 20000 - Ошибки при валидации параметров
 - 30000 - Ошибки логики приложения
 - 30100 - Сообщения или ошибки аутентификации
 - 40000 - Ошибки сервера приложения (фатальные)
 - 50000 - Неизвестные

При ```success:true``` может присутствовать ```result```, при ```success:false``` обязательным будет присутствие ```error```

```json
{
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
  "success": false,
  "error": {
    "code": 20000,
    "message": "Ошибка в параметрах запроса"
  }
}
```

Если запросу требуется аутентификация, будет возвращен код 30100 и передан временный токен аутентификации.

```json
{
  "success": false,
  "error": {
    "code": 30100,
    "message": "Требуется аутентификация"
  },
  "token": "new authentication token"
}
```
