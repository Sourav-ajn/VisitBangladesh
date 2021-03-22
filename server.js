const app = require('./app');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config({path:'./config.env'});

mongoose.connect(process.env.DATABASE_NAME,{
    useNewUrlParser:true,
    useCreateIndex:true,
    useFindAndModify:true,
    useUnifiedTopology:true
}).then(()=>{
    console.log("DB is connected")
}).catch((err)=>{
    console.log(err.message)
});


const port = process.env.PORT || 3500

app.listen(port, (req,res)=>{
    console.log('Server is listen in port ', + port)
})
