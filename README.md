# Futtatás

Szükséges egy engedélyezett API kulcsokat tartalmazó fájl a build/keys.json-ba. Így kell kinéznie:

```json
{
  "keys": [ "test123", "test456" ]
}
```

A Makefile `run` targetje elindítja a programot. make hiányában le lehet futtatni a parancsokat magukban.
