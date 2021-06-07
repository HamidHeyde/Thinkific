//Packages
var http = require('http');
var MongoClient = require('mongodb').MongoClient;
var userDAO = require('./api/DAOs/user.DAO');
var counterDAO = require('./api/DAOs/counter.DAO');

//Variables
const PORT = process.env.PORT || 5500;
var nodeEnvironment = typeof(process.env.NODE_ENV)!= undefined ? process.env.NODE_ENV : 'development';
nodeEnvironment = (['development','production'].indexOf(nodeEnvironment))>-1 ? nodeEnvironment : 'development';
process.env.NODE_ENV = nodeEnvironment;

//APP
var app = require('./api/server');

// HTTP Server
const httpServer = http.createServer(app);

//MongoDB
MongoClient.connect(
    process.env.DB_URI,
    {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        poolSize:50,
        connectTimeoutMS:5000,
        writeConcern: {
            j: true
        }
    }
  )
    .catch(err => {
      console.error(err.stack)
      process.exit(1);
    })
    .then(async client => {
        //Connect to User collection
        await userDAO.injectDB(client);
        await counterDAO.injectDB(client);
      
    //HTTP Server
    httpServer.listen(PORT,function(){
        console.log(`app is listening on port => ${PORT} in ${nodeEnvironment}`)
    });
    
})