import express, { json } from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import { dbconnection } from './Connection/dbconnection.js';
import userroutes from './Routes/userroutes.js';
const app = express()
const port = 3000
dotenv.config();
dbconnection();

const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:5174',
  'http://localhost:5175'
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

app.use(json());
app.use('/api', userroutes)

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
