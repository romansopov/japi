# JAPI 1.0

Modern JSON-RPC API

# Request object

**japi**

 A String specifying the version of the JAPI protocol.

```json
{
  "japi": "1.0",
  "method": "controller.method",
  "params": [{
    "name": "Roman Sopov"
  }],
  "id": 1,
  "token": "authentication token"
}
```
