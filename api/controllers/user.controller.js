var helpers = require('../helpers');
var userDAO = require('../DAOs/user.DAO');
var axios = require('axios');

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

const { OAuth2Client } = require('google-auth-library')
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
user.loginGoogle= async function(req,res,next){
    
    try{
        //Sanity Check
        var googleToken = (typeof(req.body.idToken)!== 'undefined')?req.body.idToken.trim():false;
        if (googleToken){
            
            var ticket = await client.verifyIdToken({ 
                idToken: googleToken,
                audience: process.env.GOOGLE_CLIENT_ID 
            })
            const { email } = ticket.getPayload(); 
            var userData  =  await userDAO.getUser(email);

            if(userData){

                var token  = await helpers.signToken(userData._id);
                (token)
                ?res.status(200).send({'message': token})
                :res.status(500).send({'message': 'Could not generate Token'})

            }else{

                var hp = await helpers.hashPassword(email);
                var userObject = {
                    'email':email,
                    'password':hp,
                }
                //Insert user
                var insertResult = await userDAO.addUser(userObject);
                
                if(insertResult.success)
                {
                    userData  =  await userDAO.getUser(email);
                    var token  = await helpers.signToken(userData._id);
                    (token)
                    ?res.status(200).send({'message': token})
                    :res.status(500).send({'message': 'Could not generate Token'})
                }
                else{
                    res.status(500).send({'message': 'Could Not Insert User'})
                };
            }

        }else{
            res.status(422).send({'message': 'Token Does Not Exist!'});
        }

    }catch(e){
        next(e.message);
    }
}

user.loginFacebook= async function(req,res,next){
    try{
        //Sanity Check
        var userId = (typeof(req.body.userId)!== 'undefined')?req.body.userId.trim():false;
        var accessToken = (typeof(req.body.accessToken)!== 'undefined')?req.body.accessToken.trim():false;
        
        var Vurl = `https://graph.facebook.com/v2.11/${userId}/?fields=id,name,email&access_token=${accessToken}`;

        if (userId && accessToken){
            
            var ticket  = await axios({
                method: "get",
                url: Vurl
            })

            const { email } = ticket.data;
            var userData  =  await userDAO.getUser(email);

            if(userData){

                var token  = await helpers.signToken(userData._id);
                (token)
                ?res.status(200).send({'message': token})
                :res.status(500).send({'message': 'Could not generate Token'})

            }else{

                var hp = await helpers.hashPassword(email);
                var userObject = {
                    'email':email,
                    'password':hp,
                }
                //Insert user
                var insertResult = await userDAO.addUser(userObject);
                
                if(insertResult.success)
                {
                    userData  =  await userDAO.getUser(email);
                    var token  = await helpers.signToken(userData._id);
                    (token)
                    ?res.status(200).send({'message': token})
                    :res.status(500).send({'message': 'Could not generate Token'})
                }
                else{
                    res.status(500).send({'message': 'Could Not Insert User'})
                };
            }

        }else{
            res.status(422).send({'message': 'Token Does Not Exist!'});
        }

    }catch(e){
        next(e.message);
    }
}

module.exports = user;