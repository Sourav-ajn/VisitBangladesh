const AppError = require("../utility/appError");

const sendErrorDev = (err,res) =>{
    res.status(err.statusCode).json(
        {
            status : err.status,
            error : err,
            message : err.message,
            stack : err.stack
        }
    );
};

const sendErrorProd = (err,res) =>{
    if(err.isOperational){
        res.status(err.statusCode).json(
            {
                status : err.status,
                message : err.message
            });
    } else {
        res.status(500).json(
            {
                status : 'error',
                message : 'Something went wrong'
            });

    }
    
};
const handleCastError = (err)=>{
    const message = `Invalid ${err.path} : ${err.value}`
    return new AppError(message,400);
}

const handleDuplicateField = (err) => {
    const message = `Duplicate field value`
    return new AppError(message,400)
}

const handleValidationError = (err) => {
     const errors = Object.values(err.errors).map(el => el.message);
     const message = `Invalid Input Data. ${errors.join(', ')}.`
     return new AppError(message,400)
}
const handleJWTError = () =>
  new AppError('Invalid token. Please log in again!', 401);

const handleJWTExpiredError = () =>
  new AppError('Your token has expired! Please log in again.', 401);

module.exports = (err,rea,req,next)=>{
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'Error';

    if(process.env.NODE_ENV === 'development'){
        sendErrorDev(err,res)
    }else if(process.env.NODE_ENV === 'production'){
        let error = {...err}
        
        if(error.name === 'CastError') {
            error=handleCastError(error)
        }

        if (error.code === 11000){
            error = handleDuplicateField(error) 
        }

        if (error.name === 'ValidationError'){
            error = handleValidationError(error)
        }
        if (error.name === 'JsonWebTokenError'){
            error = handleJWTError()};

        if (error.name === 'TokenExpiredError'){
            error = handleJWTExpiredError()};
            
        sendErrorProd(err,res)
    } 
};