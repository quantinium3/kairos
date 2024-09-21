import dotenv from 'dotenv';
import { app } from './app.js';

dotenv.config({
  path: './.env',
});

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server is running at port: ${PORT}`);
});
