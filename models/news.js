let db = require('../common/db');

/**
 * @description Model for news
 */
module.exports = {
    /**
     * query news which matches conditions
     * @param {Object} conditions 
     * @param {(err: Error, rows: any[])} callback 
     */
    select(conditions, callback) {
        let page = conditions.page.page,
            pageSize = conditions.page.size;
        let orders = conditions.orders;
        let offset = (page - 1) * pageSize;
        db.all(`SELECT * FROM news limit ${pageSize} offset ${offset}`, (err, rows) => {
            callback(err, rows);
        });
    },
    /**
     * query news which matches conditions
     * @param {Object} conditions 
     * @param {(err: Error, o: {total: number, pageCount: number, page: number, size: number, rows: any[]})} callback 
     */
    selectWithPage(conditions, callback) {
        let page = conditions.page.page,
            pageSize = conditions.page.size;
        let orders = conditions.orders;
        let offset = (page - 1) * pageSize;
        db.get(`SELECT count(id) as count FROM news`, (err, row) => {
            let count = row.count;
            let pageCount = Math.floor((count + pageSize - 1) / pageSize);
            if (pageCount == 0) pageCount = 1;
            if (count <= offset) {
                callback(err, {
                    total: count,
                    pageCount: pageCount,   // total page count
                    page: page,
                    size: pageSize,
                    rows: [],
                });
                return;
            }
            db.all(`SELECT * FROM news limit ${pageSize} offset ${offset}`, (err, rows) => {
                // console.log(rows);
                callback(err, {
                    total: count,
                    pageCount: pageCount,   // total page count
                    page: page,
                    size: pageSize,
                    rows: rows,
                });
            });
        });
    },
    /**
     * query a news by id
     * @param {number} id 
     * @param {(err: Error, row: Object)} callback 
     */
    selectById(id, callback) {
        db.get(`SELECT * FROM news where id=${id}`, (err, row) => {
            callback(err, row);
        });
    },
    /**
     * insert a news
     * @param {Object} data 
     * @param {(err: Error)} callback 
     */
    insertOne(data, callback) {
        data.time = new Date();
        var statement = db.prepare(`INSERT INTO news
            (title, content, img_url, time)
            VALUES (?, ?, ?, ?)`);
        statement.run(data.title, data.content, data.img_url, data.time);
        statement.finalize(callback);
    },
    /**
     * update a news
     * @param {Object} data 
     * @param {(err: Error)} callback 
     */
    updateById(data, callback) {
        data.time = new Date();
        var statement = db.prepare(`UPDATE news
            SET title=?, content=?, img_url=?, time=?
            WHERE id=?`);
        statement.run(data.title, data.content, data.img_url, data.time, data.id);
        statement.finalize(callback);
    },
    /**
     * delete a news
     * @param {number} id 
     * @param {(err: Error)} callback 
     */
    deleteById(id, callback) {
        var statement = db.prepare(`DELETE FROM news
            WHERE id=?`);
        statement.run(id);
        statement.finalize(callback);
    }
}