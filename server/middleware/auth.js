import jwt from 'jsonwebtoken';

export const verifyToken = async(req,res,next) =>{
    try{
        let token = req.header("Authorization");   //from req to frontend we grab the authorization header

        if(!token){
            return res.status(403).send("Access Denied");
        }

        if(token.startsWith("Bearer ")){
            token = token.slice(7,token.length).trimLeft();   //token should start from bearer and we will take everything from right of bearer
        }

        const verified = jwt.verify(token,process.env.JWT_SECRET);
        req.user = verified;
        next();

    }catch(err){
        res.status(500).json({error:err.message});
    }
}