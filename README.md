# Futtatás

Szükséges egy engedélyezett API kulcsokat tartalmazó fájl a build/keys.json-ba. Így kell kinéznie:

```json
{
  "keys": [ "test123", "test456" ]
}
```

Szükséges a build/db-creds.json is, erre van minta a repository rootban.

A Makefile `run` targetje elindítja a programot. make hiányában le lehet futtatni a parancsokat magukban.
