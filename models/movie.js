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
     * query movies which matches conditions
     * @param {Object} conditions 
     * @param {(err: Error, o: {total: number, pageCount: number, page: number, size: number, rows: any[]})} callback 
     */
    selectWithPage(conditions, callback) {
        let page = conditions.page.page,
            pageSize = conditions.page.size;
        let orders = conditions.orders;
        let offset = (page - 1) * pageSize;
        db.get(`SELECT count(id) as count FROM movie`, (err, row) => {
            let count = row.count;
            let pageCount = Math.floor((count + pageSize - 1) / pageSize);
            console.log(count, pageCount, pageSize, (count + pageSize - 1));
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
            db.all(`SELECT * FROM movie limit ${pageSize} offset ${offset}`, (err, rows) => {
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
     * query movies which matches conditions
     * @param {Object} conditions 
     * @param {(err: Error, o: {total: number, pageCount: number, page: number, size: number, rows: any[]})} callback 
     */
    selectWithPageOrderByScore(conditions, callback) {
        let page = conditions.page.page,
            pageSize = conditions.page.size;
        let key = conditions.key;
        let orders = conditions.orders;
        let offset = (page - 1) * pageSize;
        // some problem with SQL injection
        console.log(`SELECT count(id) as count FROM movie WHERE name LIKE '%${key}%'`); // a%' and introduction LIKE '%s
        // let statement = db.prepare(`SELECT count(id) as count FROM movie WHERE name LIKE '%?%'`);
        // statement.get([key], (err, row) => {
        db.get(`SELECT count(id) as count FROM movie WHERE name LIKE '%${key}%'`, (err, row) => {
            console.log(err, row);
            let count = row.count;
            let pageCount = Math.floor((count + pageSize - 1) / pageSize);
            if (pageCount == 0) pageCount = 1;
            console.log(count, pageCount, pageSize, (count + pageSize - 1));
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
            db.all(`SELECT * FROM movie  WHERE name LIKE '%${key}%' ORDER BY score desc limit ${pageSize} offset ${offset}`, (err, rows) => {
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