const mongoose  = require('mongoose');
const dotenv = require('dotenv');
const bodyparser = require('body-parser');
const cors = require('cors');
const express = require('express');

const app = express();

//Middleswares
app.use(cors());
app.use(bodyparser.json());
dotenv.config();

//Import routes
const postsRoute = require('./routes/posts')

//Middlewares
app.use('/posts', postsRoute);

//ROUTES
app.get('/', (req, res) => {
    res.send('We are on home');
});

app.use(express.json());

//CONNECT TO DB
mongoose.connect(process.env.DB_CONNECTION)
.then(()=> console.log('Connected to MongoDB...'))
.catch(err => console.log('Could not connect to MongoDB...', err));

//HOW TO LISTEN TO SERVER
const port = 3000;
app.listen(port, () => console.log(`Server Listening... ${port}`));