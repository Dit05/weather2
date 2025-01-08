import express from 'express';
import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';
import * as fs from 'node:fs';
import * as mysql from 'mariadb';
import * as db from './db.js';



const keys: string[] = JSON.parse(fs.readFileSync('keys.json', { encoding: 'utf8' })).keys;

const app = express();

const swaggerDocument = YAML.load('./openapi.yaml');
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use(express.json());


const port = 3000;
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});


app.get('/cities', async (_req, res) => {
  const conn: mysql.Connection = await db.getConnection();
  res.json(await conn.query("SELECT * FROM weather.Cities"));
  conn.end();
});


type Wind = {
  magnitude: number,
  direction: "E" | "K" | "D" | "NY" | "EK" | "DK" | "DNY" | "ENY"
};

type Error = {
  what: string
};


function recordToWind(record: any): Wind {
  return {
    magnitude: Number(record.wind_magnitude),
    direction: record.wind_direction,
  };
}

function tryParseWind(json: any): Wind | null {
  const mag = Number(json.magnitude);
  if(mag < 0 || mag > 999.9) return null;
  const dir = json.direction;
  if(dir === undefined || !["E", "K", "D", "NY", "EK", "DK", "DNY", "ENY"].includes(dir)) return null;

  return {
    magnitude: mag,
    direction: dir
  };
}

function createError(msg: string): Error {
  return {
    what: msg
  };
}


app.get('/wind/:cityId/:date/:hour', async (req, res) => {
  try {
    if(isNaN(Number(req.params.hour)) || Number(req.params.hour) < 0 || Number(req.params.hour) > 23) {
      res.statusCode = 400;
      res.json(createError('Invalid hour'));
    }

    let result: [any];
    const conn: mysql.Connection = await db.getConnection();
    try {
      result = await conn.query(
        "SELECT wind_magnitude, wind_direction FROM weather.Winds WHERE city_id=? AND date=? AND hour=?",
        [req.params.cityId, req.params.date, req.params.hour]
      );
    } finally {
      conn.end();
    }


    if(result.length > 0) {
      res.json(recordToWind(result[0]));
    } else {
      res.sendStatus(404);
    }
  } catch(error) {
    console.error('Unhandled exception:', error);
    res.statusCode = 500;
    res.end();
  }
});

app.put('/wind/:cityId/:date/:hour', async (req, res) => {
  try {
    if(!keys.includes(req.headers.authorization ?? "")) {
      res.statusCode = 401;
      res.end();
      return;
    }

    if(isNaN(Number(req.params.hour)) || Number(req.params.hour) < 0 || Number(req.params.hour) > 23) {
      res.statusCode = 400;
      res.json(createError('Invalid hour'));
    }

    const wind: Wind | null = tryParseWind(req.body);
    if(wind === null) {
      res.json(createError("Invalid wind"));
    } else {
      const conn: mysql.Connection = await db.getConnection();
      try {
        await conn.query(
          { namedPlaceholders: true, sql: "INSERT INTO weather.Winds (city_id, date, hour, wind_magnitude, wind_direction) VALUES (:city_id, :date, :hour, :wind_magnitude, :wind_direction) ON DUPLICATE KEY UPDATE wind_magnitude=:wind_magnitude, wind_direction=:wind_direction" },
          { city_id: req.params.cityId, date: req.params.date, hour: req.params.hour, wind_magnitude: wind.magnitude, wind_direction: wind.direction }
        );
      } finally {
        conn.end();
      }
    }

    res.end();
  } catch(error) {
    console.error('Unhandled exception:', error);
    res.statusCode = 500;
    res.end();
  }
});

app.delete('/wind/:cityId/:date/:hour', async (req, res) => {
  try {
    if(!keys.includes(req.headers.authorization ?? "")) {
      res.statusCode = 401;
      res.end();
      return;
    }

    if(isNaN(Number(req.params.hour)) || Number(req.params.hour) < 0 || Number(req.params.hour) > 23) {
      res.statusCode = 400;
      res.json(createError('Invalid hour'));
    }

    let result;
    const conn: mysql.Connection = await db.getConnection();
    try {
      result = await conn.query(
        "DELETE FROM weather.Winds WHERE city_id=? AND date=? AND hour=?",
        [req.params.cityId, req.params.date, req.params.hour]
      );
    } finally {
      conn.end();
    }

    if(result.affectedRows === 1) {
      res.statusCode = 200;
    } else {
      res.statusCode = 404;
    }

    res.end();
  } catch(error) {
    console.error('Unhandled exception:', error);
    res.statusCode = 500;
    res.end();
  }
});


app.get('/wind/queries/hourly/:cityId/:date', async (req, res) => {
  try {
    let result: any[];
    const conn: mysql.Connection = await db.getConnection();
    try {
      result = await conn.query(
        // Genuis!
        "SELECT Winds.wind_magnitude FROM\
          (SELECT 0 AS number UNION ALL SELECT 1 UNION ALL SELECT 2 UNION ALL SELECT 3 UNION ALL SELECT 4 UNION ALL SELECT 5 UNION ALL SELECT 6 UNION ALL SELECT 7 UNION ALL SELECT 8 UNION ALL SELECT 9 UNION ALL SELECT 10 UNION ALL SELECT 11 UNION ALL SELECT 12 UNION ALL SELECT 13 UNION ALL SELECT 14 UNION ALL SELECT 15 UNION ALL SELECT 16 UNION ALL SELECT 17 UNION ALL SELECT 18 UNION ALL SELECT 19 UNION ALL SELECT 20 UNION ALL SELECT 21 UNION ALL SELECT 22 UNION ALL SELECT 23) AS n\
          LEFT JOIN weather.Winds ON n.number = weather.Winds.hour AND weather.Winds.city_id=? AND weather.Winds.date=?\
          ORDER BY n.number\
        ",
        [req.params.cityId, req.params.date]
      );
    } finally {
      conn.end();
    }

    res.json(result.map(res => res.wind_magnitude === null ? null : Number(res.wind_magnitude)));
  } catch(error) {
    console.error('Unhandled exception:', error);
    res.statusCode = 500;
    res.end();
  }
});

app.get('/wind/queries/today/:cityId/:hour', async (req, res) => {
  try {
    if(isNaN(Number(req.params.hour)) || Number(req.params.hour) < 0 || Number(req.params.hour) > 23) {
      res.statusCode = 400;
      res.json(createError('Invalid hour'));
    }

    let result: [any];
    const conn: mysql.Connection = await db.getConnection();
    try {
      result = await conn.query(
        "SELECT wind_magnitude, wind_direction FROM weather.Winds WHERE city_id=? AND date=TO_CHAR(NOW(), 'yyyy.mm.dd') AND hour=?",
        [req.params.cityId, req.params.hour]
      );
    } finally {
      conn.end();
    }


    if(result.length > 0) {
      res.json(recordToWind(result[0]));
    } else {
      res.sendStatus(404);
    }
  } catch(error) {
    console.error('Unhandled exception:', error);
    res.statusCode = 500;
    res.end();
  }
});
