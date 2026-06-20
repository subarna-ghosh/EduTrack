const jwt = require('jsonwebtoken');
const httpStatusCode = require('../../utils/httpStatusCode');


const AuthCheck = (req, res, next) => {
   
   const token = req?.body?.token||req?.query?.token||req?.headers['x-access-token']||req?.headers['authorization'];
    if(!token){
        return res.status(httpStatusCode.BAD_REQUEST).json({
            status: false,
            message: 'Token is required for access this url'
        })
    }
    try{
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET_KEY);
        req.user = decoded;
        
    }catch(err){
        return res.status(httpStatusCode.SERVER_ERROR).json({
            status: false,
            message: "invalid token"
        })
    }
    return next();

}


module.exports = AuthCheck;