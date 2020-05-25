let db = require('../common/db');

/**
 * @description Model for Movie
 */
module.exports = {
    /**
     * query movies which matches conditions
     * @param {Object} conditions 
     * @param {(err: Error, rows: any[])} callback 
     */
    select(conditions, callback) {
        let page = conditions.page.page,
            pageSize = conditions.page.size;
        let offset = (page - 1) * pageSize;
        db.all(`SELECT * FROM movie limit ${pageSize} offset ${offset}`, (err, rows) => {
            callback(err, rows);
        });
    },
    /**
     * insert a movie into database
     * @param {Object} data 
     * @param {(err: Error)} callback 
     */
    insertOne(data, callback) {
        var statement = db.prepare('INSERT INTO movie (name, description, score) VALUES (?, ?, ?)');
        statement.run(data.name, data.description, data.score);
        statement.finalize(callback);
    }
}