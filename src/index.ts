import express from 'express';
import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';
import * as mysql from 'mariadb';
import * as db from './db.js';


const app = express();

const swaggerDocument = YAML.load('./openapi.yaml');
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));


const port = 3000;
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});


app.get('/cities', async (_req, res) => {
  const conn: mysql.Connection = await db.getConnection();
  res.json(await conn.query("SELECT * FROM weather.Cities"));
});

app.get('/wind/:cityId/:date/:hour', async (req, res) => {
  res.json(
    req.params
  );
});
