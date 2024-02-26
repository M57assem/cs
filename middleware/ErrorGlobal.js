const globalError =((err,req,res,next)=>{
    err.statusCode = err.statusCode || 500;
    err.status =  err.status || 'error'
    res.status(err.statusCode ).json({
        status: err.status,
        error:err,
        message:err.message,
        // دي بتقولي مكان err فين 
        // stack:err.stack,
    });
})
module.exports = globalError;
