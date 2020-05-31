let db = require('./db');

function createTableUser() {
    db.run(`CREATE TABLE user (
        id INTEGER PRIMARY KEY AUTOINCREMENT     NOT NULL,
        username VARCHAR(32)    NOT NULL,
        nickname VARCHAR(255)           ,
        password VARCHAR(128)   NOT NULL,
        role VARCHAR(8)         NOT NULL,
        age INTEGER                     ,
        country VARCHAR(128)            ,
        gender VARCHAR(8)
    )`);
}
function createTableMovie() {
    db.run(`CREATE TABLE movie (
        id INTEGER PRIMARY KEY AUTOINCREMENT     NOT NULL,
        name VARCHAR(255)       NOT NULL,
        category VARCHAR(128)           ,
        introduction TEXT               ,
        date    VARCHAR(32)             ,
        country    VARCHAR(128)         ,
        img_url VARCHAR(1024)           ,
        score DECIMAL(10,5)             
    )`);
}
function createTableNews() {
    db.run(`CREATE TABLE news (
        id INTEGER PRIMARY KEY AUTOINCREMENT     NOT NULL,
        title VARCHAR(255)      NOT NULL,
        content TEXT                    ,
        time    DATE                    ,
        img_url VARCHAR(1024)
    )`);
}
function clearTable(table) {
    db.run(`DELETE FROM ${table}`);
}
function dropTable(table) {
    db.run(`DROP TABLE ${table}`);
}
function selectAll(table) {
    db.all(`SELECT * FROM ${table}`, function (err, rows) {
        console.log(table + ':', rows);
    });
}

db.serialize(function () {
    // dropTable('news');
    // createTableUser();
    // createTableMovie();
    // createTableNews();
    // clearTable("movie");
    // clearTable("user");
    // selectAll('user');
    // selectAll('movie');
    // selectAll('news');
    // db.run(`update user
    //     set role='Administrator'
    //     where username='admin'
    // `);
});
// close database connection
db.close();