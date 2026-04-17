import express, { Router } from 'express';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';
import router from './routes/booksRoutes.js';
import cors from 'cors'

const app = express();
app.use(express.json());
app.use(cors());

// app.use(cors(
//   {
//     origin: 'http://localhost:3000',
//     methods: ['Get', 'Post', 'Put', 'Delete'],
//     allowedHeaders: ['content-type']
//   }
// ))

app.use('/api/books', router);

dotenv.config()
const PORT = process.env.PORT||3000;


app.get('/', (req,res)=>{
  console.log("this is home page");
  return res.status(232).send("welcome this is home page")
})


connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  })
}); 