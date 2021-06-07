var counterDAO={
    counters:null
};

/**
 * Finds a user in the `users` collection
 * @param {string} conn - The connection string for db
 * @returns {collection} Returns the counters collection from db or throws an Error
 */
counterDAO.injectDB = async function(conn){
    try{
        if (counterDAO.counters) {
            return
        }

        counterDAO.counters = await conn.db(process.env.DB_NAME).collection("counters");
    }
    catch(e){
        console.log(e.message);
        throw new Error(e.message);
    }
};

/**
 * Finds a user in the `users` collection
 * @param {string} name - The name of the counter
 * @returns {Object | null} Returns either a counter or nothing or throws an Error
 */
 counterDAO.getCounter =  async function(name) {
    try{
        return( await counterDAO.counters.findOne({ "name": name }))
        
    }catch(e){
        throw new Error(e.message);
    }
}

/**
   * Adds a user to the `sessions` collection
   * @param {string} name - Counter Name
   * @param {string} value - Value to reset the counter to
   * @returns {Object} Returns either a {success:true} or throws an Error
   */
 counterDAO.updateCounter =  async function(name, value) {
    try {
      await counterDAO.counters.updateOne(
        { "name": name },
        { $set: { "value": value } }
      )

      return ({'success': true});

    } catch (e) {
        throw new Error(e.message);
    }
  }

module.exports = counterDAO;