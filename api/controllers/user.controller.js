var helpers = require('../helpers');
var userDAO = require('../DAOs/user.DAO');

var user={};

user.registerUser= async function(req,res,next){
    
    try{
        //Sanity Check
        var userEmail = (typeof(req.body.email)!== 'undefined')?req.body.email.trim():false;
        var userPassword = (typeof(req.body.password)!== 'undefined')?req.body.password.trim():false;
        if (userEmail && userPassword){
            //Get User
            var userData  =  await userDAO.getUser(userEmail);
            if(!userData){
                //Hash Password
                var hp = await helpers.hashPassword(userPassword);
                var userObject = {
                    'email':userEmail,
                    'password':hp,
                }
                //Insert user
                var insertResult = await userDAO.addUser(userObject);
                
                (insertResult.success)
                ?res.status(200).send({'message': 'User Registered Successfully'})
                :res.status(500).send({'message': 'Could Not Insert User'});

            }else{
                res.status(400).send({'message': 'User Exist'});
            }

        }else{
            res.status(422).send({'message': 'Email or password Does not Exist!'});
        }

    }catch(e){
        next(e.message);
    }
}

user.loginUser= async function(req,res,next){
    
    try{
        //Sanity Check
        var userEmail = (typeof(req.body.email)!== 'undefined')?req.body.email.trim():false;
        var userPassword = (typeof(req.body.password)!== 'undefined')?req.body.password.trim():false;
        if (userEmail && userPassword){
            
            //Get User
            var userData  =  await userDAO.getUser(userEmail);
            if(userData){
                //Compare Passwords
                var comparisonResult = await helpers.comparePasswords(userPassword,userData.password);
                if (comparisonResult){
                    //Sign The token
                    var token  = await helpers.signToken(userData._id);
                    (token)
                    ?res.status(200).send({'message': token})
                    :res.status(500).send({'message': 'Could not generate Token'})

                }else{
                    res.status(401).send({'message': 'password Does not Match'})
                }
            }else{
                res.status(400).send({'message': 'User Does Not Exist'});
            }

        }else{
            res.status(422).send({'message': 'Email or password Does not Exist!'});
        }

    }catch(e){
        next(e.message);
    }
}

module.exports = user;