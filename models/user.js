let db = require('../common/db');

module.exports = {
    count(callback) {
        db.get(`SELECT count(*) as count FROM user`, (err, row) => {
            callback(err, row);
        });
    },
    /**
     * query a user by id
     * @param {(err: Error, rows: Object[])} callback 
     */
    selectAll(callback) {
        db.all(`SELECT * FROM user`, (err, rows) => {
            callback(err, rows);
        });
    },
    /**
     * query a user by id
     * @param {string} username 
     * @param {(err: Error, row: Object)} callback 
     */
    selectById(id, callback) {
        db.all(`SELECT * FROM user where id = ${id}`, (err, rows) => {
            let row = null;
            if (!rows || rows.length < 1) row = null;
            else row = rows[0];
            callback(err, row);
        });
    },
    /**
     * query a user by username
     * @param {string} username 
     * @param {(err: Error, row: Object)} callback 
     */
    selectByUsername(username, callback) {
        db.all(`SELECT * FROM user where username = '${username}'`, (err, rows) => {
            let row = null;
            if (!rows || rows.length < 1) row = null;
            else row = rows[0];
            callback(err, row);
        });
    },
    /**
     * insert a user
     * @param {Object} data 
     * @param {(err: Error)} callback 
     */
    insertOne(data, callback) {
        this.count((err, row) => {
            data.role = 'user';
            if (row.count < 1) {
                // the first user, set it as an administrator
                data.role = 'admin';
            }
            // check whether the username exists
            this.selectByUsername(data.username, (err, row) => {
                if (err) {
                    callback(err);
                    return;
                }
                if (row) {
                    callback(new Error("Username existed"));
                    return;
                }
                var statement = db.prepare(`INSERT INTO user
                    (username, nickname, password, role, gender, age, country)
                    VALUES (?, ?, ?, ?, ?, ?, ?)`);
                statement.run(data.username, data.nickname, data.password, data.role, data.gender, data.age, data.country);
                statement.finalize(callback);
            });
        });
    },
    /**
     * update some info of a user by its id
     * @param {Object} data 
     * @param {(err: Error)} callback 
     */
    updateById(data, callback) {
        var statement = db.prepare(`UPDATE user
            SET username=?, nickname=?, password=?, role=?, gender=?, age=?, country=?
            WHERE id=?`);
        if (data.age === '') data.age = null;
        statement.run(data.username, data.nickname, data.password, data.role, data.gender, data.age, data.country, data.id);
        statement.finalize(callback);
    }
}