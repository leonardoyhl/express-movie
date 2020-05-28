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
        let orders = conditions.orders;
        let offset = (page - 1) * pageSize;
        db.all(`SELECT * FROM movie limit ${pageSize} offset ${offset}`, (err, rows) => {
            callback(err, rows);
        });
    },
    /**
     * query a movie by id
     * @param {number} id 
     * @param {(err: Error, row: Object)} callback 
     */
    selectById(id, callback) {
        db.get(`SELECT * FROM movie where id=${id}`, (err, row) => {
            callback(err, row);
        });
    },
    /**
     * insert a movie
     * @param {Object} data 
     * @param {(err: Error)} callback 
     */
    insertOne(data, callback) {
        var statement = db.prepare(`INSERT INTO movie
            (name, category, introduction, date, country, img_url, score)
            VALUES (?, ?, ?, ?, ?, ?, ?)`);
        statement.run(data.name, data.category, data.introduction, data.date, data.country, data.img_url, data.score);
        statement.finalize(callback);
    },
    /**
     * update a movie
     * @param {Object} data 
     * @param {(err: Error)} callback 
     */
    updateById(data, callback) {
        var statement = db.prepare(`UPDATE movie
            SET name=?, category=?, introduction=?, date=?, country=?, img_url=?, score=?
            WHERE id=?`);
        statement.run(data.name, data.category, data.introduction, data.date, data.country, data.img_url, data.score, data.id);
        statement.finalize(callback);
    },
    /**
     * delete a movie
     * @param {number} id 
     * @param {(err: Error)} callback 
     */
    deleteById(id, callback) {
        var statement = db.prepare(`DELETE FROM movie
            WHERE id=?`);
        statement.run(id);
        statement.finalize(callback);
    }
}