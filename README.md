# JAPI 1.0

Modern JSON-RPC API

## Request object

### japi

A String specifying the version of the JAPI protocol.

### method

A String containing the name of the method to be invoked. Method names that begin with the word rpc followed by a period character (U+002E or ASCII 46) are reserved for rpc-internal methods and extensions and MUST NOT be used for anything else.

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
