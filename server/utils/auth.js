const jwt = require('jsonwebtoken')

const secret = process.env.SECRET_JWT || 'mysecretsshh';
const expiration = '7d'

module.exports = {
    authMiddleware: function({req}){
        let token = req.body.token || req.query.token || req.headers.authorization;
        console.log("Authorization Header:", req.headers.authorization);
        console.log("Token from body/query:", token);
        if(req.headers.authorization){
            const parts = req.headers.authorization.split(' ');
            if(parts[0] !== 'Bearer' || parts.length !== 2){
                throw new Error('Authorization header format must be Bearer <token>')

            }
            token = parts[1].trim()
        }
        if(!token){
            return req
        }

        try{
            const {data} = jwt.verify(token, secret, {maxAge: expiration})
            req.user = data;
        }catch(err){
            console.log('token not vaild', err.message)
            throw new Error('Token is not valid')
        }
        return req
    },
    signToken: function({username, email, _id}){
        const payload = {username,email, _id};
        return jwt.sign({data: payload}, secret, {expiresIn: expiration})
    }
}