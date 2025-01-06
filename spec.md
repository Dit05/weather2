Nooooooooooooode.js RESTful alkalmazást kell készítenie.
`localhost:3000/wind`

Az adatbázisban van 2 tábla, az egyikben a helység neve és kódja van, pl. 1 Eger, 2 Heves, 3 Budapest, stb.
Ne numerikus legyen a kód.

A másik táblában: 
- Helység kód
- Dátum (év.hó.nap)
- Óra
- Szélerő (km/h)
- Iránya (E,K,D,NY,EK (evőkanál),DK,DNY,ENY)

Lehessen felvinni, módosítani, törölni. (A helység táblához nem kell ilyen.) +OpenAPI.

Valamint legyen két lekérdezés:
- Az egyik visszaadja a megadott helységben az adott napon mekkora szél van (lesz) az egyes órákban.
- A másik esetében a megadott órában, a megadott helységben mekkora szél van (lesz). (Persze az iránya is kell!)

## Plusz követelmények
- Küldd el az sqldump-ot
- A tesztek legalább 80%-ra legyenek kitöltve
