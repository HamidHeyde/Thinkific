var helpers = require('../helpers');
var counterDAO = require('../DAOs/counter.DAO');

var counter = {};

counter.getCurrentCounter = async function(req,res,next){
    try{
        var counterData  =  await counterDAO.getCounter('default');
        (counterData)
        ?res.status(200).send({'message': counterData.value})
        :res.status(500).send({'message': 'Problem with reading the counter!'});

    }catch(e){
        next(e.message);
    }
}

counter.getNextCounter = async function(req,res,next){
    try{
        var counterData  =  await counterDAO.getCounter('default');
        if(counterData){
            var nextValue = parseInt(counterData.value)+1;
            var updateResults = await counterDAO.updateCounter('default',nextValue.toString());
            
            (updateResults.success)
            ?res.status(200).send({'message': nextValue})
            :res.status(500).send({'message': 'Problem with Updating the counter!'});

        }else{
            res.status(500).send({'message': 'Problem with reading the counter!'});
        }
    }catch(e){
        next(e.message);
    }
}

counter.updateCounter = async function(req,res,next){
    try{
        //Sanity Check
        var userCurrent = (typeof(req.body.current)!== 'undefined')?req.body.current.trim():false;
        if(userCurrent){
            var updateResults = await counterDAO.updateCounter('default',userCurrent.toString());
            
            (updateResults.success)
            ?res.status(200).send({'message': userCurrent})
            :res.status(500).send({'message': 'Problem with Updating the counter!'});
        }else{
            res.status(422).send({'message': 'current data does not exist'})
        }
    }catch(e){
        next(e.message);
    }
}

module.exports = counter;