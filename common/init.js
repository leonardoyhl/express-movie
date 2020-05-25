let db = require('./db');

function createTableMovie() {
    db.run(`CREATE TABLE movie (
        id INTEGER PRIMARY KEY AUTOINCREMENT     NOT NULL,
        name VARCHAR(255)       NOT NULL,
        description TEXT                ,
        img_url VARCHAR(1024)           ,
        score DECIMAL(10,5)
    )`);
}
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

db.serialize(function () {
    createTableUser();
    createTableMovie();
    // db.each('SELECT * FROM movie', function (err, row) {
    //     console.log(row);
    // });
});
// close database connection
db.close();