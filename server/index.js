const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();
const mysql = require("mysql");
const flash = require('connect-flash');
const cookieParser = require('cookie-parser');
const session = require('express-session');

const db = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'belajarjs',
});

app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser('keyboard cat'));
app.use(session({ cookie: { maxAge: 60000 }}));
app.use(flash());

app.get('/flash', (req, res) => {
    req.flash('deleteTodo', 'Todo telah dihapus.')
    res.redirect('/');
  });

app.post("/api/insert/user", (req, res) => {
    const nama = req.body.nama;
    if (nama != ""){
        const sqlInsertUser = "INSERT INTO user (nama) VALUES (?)";
        db.query(sqlInsertUser, [nama], (err, result) => {
            console.log(result);
        });
    }
});

app.post("/api/insert/todolist", (req, res) => {
    const isi = req.body.isi;
    const status = req.body.status;
    const id_user = req.body.id_user;

    if (isi != "" && status != "" && id_user != ""){
        const sqlInsertTodolist = "INSERT INTO todolist (isi, status, id_user) VALUES (?,?,?)";
        db.query(sqlInsertTodolist, [isi, status, id_user], (err, result) => {
            console.log(result);
        });
    }
});

app.get("/api/get/user", (req, res) => {
    const sqlSelectUser = "SELECT * FROM user";
    db.query(sqlSelectUser, (err, result) => {
        res.send(result);
    });
});

app.get("/api/get/todolist", (req, res) => {
    const id_user = req.params.id_user;
    const sqlSelectTodolist = "SELECT * FROM todolist";
    db.query(sqlSelectTodolist, id_user, (err, result) => {
        res.send(result);
    });
});

app.delete("/api/delete/todolist/:id", (req, res) => {
    const id = req.params.id;
    const sqlDelete = "DELETE FROM todolist WHERE id = ?";
    db.query(sqlDelete, id, (err, result) => {
        if (err) console.log(err);
        // window.location = '/';
        // res.render('/', { message: req.flash('deleteTodo') });
    });
});

app.delete("/api/delete/user/:id_user", (req, res) => {
    const id_user = req.params.id_user;
    const sqlDeleteUser = "DELETE FROM user WHERE id_user = ?";
    db.query(sqlDeleteUser, id_user, (err, result) => {
        if (err) console.log(err);
        res.redirect("/");
    });
});

app.put("/api/update/todolist", (req, res) => {
    const id = req.body.id;
    const status = req.body.status;
    const sqlUpdate = "UPDATE todolist SET status = ? WHERE id = ?";
    backURL = req.header('Referer') || '/';
    db.query(sqlUpdate, [status, id], (err, result) => {
        res.redirect("/");
    });
});

app.listen(3001, () => {
    console.log("running on port 3001");
});