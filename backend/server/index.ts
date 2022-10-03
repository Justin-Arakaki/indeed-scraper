import * as dotenv from 'dotenv'
import express from 'express';
import { fileURLToPath } from 'url';
import path, {dirname} from 'path';

dotenv.config()

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const publicPath = path.join(__dirname, 'public');

app.use(express.static(publicPath));

let port = process.env.PORT;
if (port === null || port === '') {
  port = '8000';
}
app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`express server listening on port ${port}`);
});
