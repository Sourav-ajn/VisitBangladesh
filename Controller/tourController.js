const mongoose = require('mongoose');
const AppError = require('../utility/appError');
const Tour = require('./../Model/tourModel');
const asyncHandler = require('./../utility/asyncHandler');

exports.topFiveTours = (req,res,next) => {
    req.query.limit = '5';
    req.query.sort = '-rating,averagePrice'
    req.query.fields = 'name,price,ratingAverage,summary,difficulty'
    next()
}


exports.getAllTours = asyncHandler(async (req,res,next)=>{
        // Filtering
        const queryObj= {...req.query};
        const excludedfield=['sort','limit','page','fields']
        excludedfield.forEach(el=> delete queryObj[el]);
        let queryStr = JSON.stringify(queryObj);
        queryStr = queryStr.replace(/\b(gt|gte|lt|lte)\b/g, m => `$${m}`)
        let query =Tour.find(JSON.parse(queryStr))        
        
        //Sorting
        if(req.query.sort){
            const sortBy= req.query.sort.split(',').join(' ')
            query= query.sort(sortBy)
        }else{
            query=query.sort('-createdAt')
        }

        // Limiting field
        if(req.query.fields){
            const field = req.query.fields.split(',').join(' ')
            query=query.select(field)
        }else{
            query=query.select('-_id')
        }
        // Pagination
        const page = req.query.page*1 || 1;
        const limit = req.query.limit || 20;
        const skip = (page - 1) * limit;

        query = query.skip(skip).limit(limit);

        const tours = await query

        console.log(tours)
        res.status(200).json({
            status : 'success',
            result : tours.length, 
            tours
        });
})

exports.createTour = asyncHandler(async (req,res,next) => {
        const newTour = new Tour(req.body);
        const tour = await newTour.save()
        res.status(201).json({
            status:'Success',
            tour
        })
});

exports.getTour = asyncHandler(async (req,res,next)=>{

    const tour= await Tour.findById(req.params.id);
    if(!tour){
        next(new AppError('No tour found with that id',404))
        return
    }
    res.status(200).json({
        status:'success',
        tour : (tour) ? tour:"No Tour Found" 

    })        
});

exports.updateTour= asyncHandler(async (req,res,next)=>{

    const tour= await Tour.findByIdAndUpdate(req.params.id,req.body,{new:true, runValidators:true})
    if(!tour){
        next(new AppError('No tour found with that id',404))
        return
    }
    res.status(201).json({
        status : 'Success',
        tour
    })
});

exports.deleteTour=asyncHandler(async (req,res, next)=>{
        const tour = await Tour.findByIdAndDelete(req.params.id);

        if(!tour){
            next(new AppError('No tour found with that id',404))
            return
        }
        res.status(201).json({
            status : 'Success',
        })
});

exports.getTourStats = asyncHandler(async(req,res,next)=>{
    
});
