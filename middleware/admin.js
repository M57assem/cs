module.exports = function (req,res,next) {
    if(!req.body.ADMIN){
        return res.status(403).send('Sorry mot Access....')
    }
    next();

}