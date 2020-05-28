let categories = require('../database/categories.json');

module.exports = {
    /**
     * 
     * @param {(err: Error, rows: any[])} callback 
     */
    selectAll(callback) {
        callback(err, categories);
    }
}