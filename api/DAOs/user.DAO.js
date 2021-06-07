var userDAO={
    users:null
};


/**
 * Finds a user in the `users` collection
 * @param {string} conn - The connection string for db
 * @returns {collection} Returns the Users collection from db or throws an Error
 */
userDAO.injectDB = async function(conn){
    try{
        if (userDAO.users) {
            return
        }

        userDAO.users = await conn.db(process.env.DB_NAME).collection("users");
    }
    catch(e){
        console.log(e.message);
        throw new Error(e.message);
    }
};

/**
 * Finds a user in the `users` collection
 * @param {string} email - The email of the desired user
 * @returns {Object | null} Returns either a single user or nothing or throws an Error
 */
userDAO.getUser =  async function(email) {
    try{
        return( await userDAO.users.findOne({ "email": email }))
        
    }catch(e){
        throw new Error(e.message);
    }
}


/**
 * Adds a user to the `users` collection
 * @param {UserInfo} userInfo - The information of the user to add
 * @returns {DAOResponse} Returns either a "success" or throws an Error
 */
 userDAO.addUser = async function(userInfo) {
    try {
        await userDAO.users.insertOne(userInfo);
        return ({'success': true});

    } catch (e) {
        throw new Error(e.message);
    }
}


module.exports = userDAO;