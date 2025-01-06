import express from 'express';
import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';


const app = express();


// Serve the Swagger UI
const swaggerDocument = YAML.load('./openapi.yaml');
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

const port = 3000;
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
