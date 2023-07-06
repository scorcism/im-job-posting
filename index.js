const express = require('express')
const app = express();
const cors = require('cors');
const connectToMongo = require('./db/dbConnect');
const dotenv = require('dotenv')
const port = process.env.PORT || 5000;
const bodyParser = require('body-parser');
dotenv.config()


app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }));
app.use(cors())
app.use(express.json())

connectToMongo()

app.get('/',(req,res)=>{
    res.send("Working get /")
})

app.use('/api/v1/utils/',require('./routes/utils'))


app.listen(port, () => {
  console.log(`Example app listening on port http://localhost:${port}`)
})