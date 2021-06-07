var bcrypt = require ('bcryptjs');
var jwt  = require ("jsonwebtoken");

var helpers={};

helpers.hashPassword = async function(password) {
    
    try{
        return( await bcrypt.hash(password, 10));
    }catch(e){
        throw new Error(e.message);
    }
}

helpers.comparePasswords = async function(userPass,dbPass) {
    
    try{
        return( await bcrypt.compare(userPass, dbPass));
    }catch(e){
        throw new Error(e.message);
    }
}

helpers.signToken = async function(_id){

    try{
        return (
            await jwt.sign(
                {"id":_id},
                process.env.JWT_SECRET,
                {expiresIn: '30m'}
            )
        );
    }catch(e){
        throw new Error(e.message);
    }
}

// helpers.verifyToken = async function(req,res,next){
helpers.verifyToken = async function(token){
    return jwt.verify(token, process.env.JWT_SECRET, (error, res) => {
        if (error) {
          return false;
        }
        return true;
      })
}

helpers.authCheck = async function(req,res,next){
    
    var userJWT = (typeof(req.get("Authorization"))!=='undefined')?req.get("Authorization"):false;
        // console.log(userJWT)
        if (userJWT){
            var token = userJWT.slice("Bearer ".length);
            // console.log(token)
            if (token){
                var userClaim = await helpers.verifyToken(token);
                // console.log(userClaim)
                if( userClaim){
                    next()
                }else{
                    res.status(401).send({'message': 'Not a valid token!'});
                }
            }else{
                res.status(401).send({'message': 'Not a valid token!'});
            }
        }else{
            res.status(401).send({'message': 'Unauthorized access!'});
        }
}

module.exports = helpers;