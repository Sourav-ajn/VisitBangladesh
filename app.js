const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const dotenv = require('dotenv');
const mongoSanitizer = require('express-mongo-sanitize');
const xssClean = require('xss-clean');
const errorHandler = require('./Controller/errorHandler');
const AppError = require('./utility/appError'); 
const tourRouter = require('./Router/tourRoute');
const userRouter = require('./Router/userRoute');  

dotenv.config({path:'./config.env'});

const app = express();


//Middleware
app.use(helmet())

app.use(express.json({'limit': '10kb'}));

if(process.env.NODE_ENV==='development'){
    app.use(morgan('dev'));
}

// Limit requests from same API
const limiter = rateLimit({
    max: 100,
    windowMs: 60 * 60 * 1000,
    message: 'Too many requests from this IP, please try again in an hour!'
  });
app.use('/api', limiter);
  
app.use(mongoSanitizer())

app.use(xssClean())
//Route

app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

app.all('*', (req,res,next)=>{

    next(AppError(`Can't find ${req.originalUrl} on this server!`), 404);
});

app.use(errorHandler);
module.exports=app;