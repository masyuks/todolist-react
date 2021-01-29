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

app.post("/api/insert/laporanChat", (req, res) => {
    const id_user = req.body.id_user;
    const tanggal = req.body.tanggal;
    const chat_masuk = req.body.chat_masuk;
    const chat_closing = req.body.chat_closing;
    if (id_user != "" && tanggal != "" && chat_masuk != "" && chat_closing!=""){
    const sqlInsertlapChat = "INSERT INTO laporanchat (id_user, tanggal, chat_masuk, chat_closing) VALUES (?,?,?,?)";
        db.query(sqlInsertlapChat, [id_user, tanggal, chat_masuk, chat_closing], (err, result) => {
            console.log(result);
            console.log(err);
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

// app.get("/api/get/laporanChat", (req, res) => {
//     // const id_user = req.params.id_user;
//     const sqlSelectLaporanChat = "SELECT user.nama, laporanchat.tanggal, SUM(chat_masuk) AS chat_masuk, SUM(chat_closing) AS chat_closing FROM laporanchat INNER JOIN user ON laporanchat.id_user=user.id_user GROUP BY tanggal, nama";
//     db.query(sqlSelectLaporanChat, (err, result) => {
//         res.send(result);
//     });
// });

// app.get("/api/getbyid/laporanChat/:id_user", (req, res) => {
//     const id_user = req.params.id_user;
//     const sqlSelectLaporanChatById = "SELECT user.nama, laporanchat.tanggal, SUM(chat_masuk) AS chat_masuk, SUM(chat_closing) AS chat_closing FROM laporanchat INNER JOIN user ON laporanchat.id_user=user.id_user WHERE laporanchat.id_user = ? GROUP BY tanggal";
//     db.query(sqlSelectLaporanChatById, id_user, (err, result) => {
//         res.send(result);
//     }); 
// });

app.get("/api/getbyid/laporanChat/:id_laporan", (req, res) => {
    const id_laporan = req.params.id_laporan;
    const sqlSelectLaporanChatById = "SELECT laporanchat.id_laporan ,user.nama, laporanchat.tanggal, laporanchat.chat_masuk, laporanchat.chat_closing FROM laporanchat INNER JOIN user ON laporanchat.id_user=user.id_user WHERE laporanchat.id_laporan = ?";
    db.query(sqlSelectLaporanChatById, id_laporan, (err, result) => {
        res.send(result);
    }); 
});


app.get("/api/get/laporanChat", (req, res) => {
    // const id_user = req.params.id_user;
    const sqlSelectLaporanChat = "SELECT laporanchat.id_laporan, laporanchat.id_user AS user_id ,user.nama, laporanchat.tanggal, laporanchat.chat_masuk, laporanchat.chat_closing FROM laporanchat INNER JOIN user ON laporanchat.id_user=user.id_user";
    db.query(sqlSelectLaporanChat, (err, result) => {
        res.send(result);
    }); 
});

app.get("/api/getbyid/laporanChat/:id_user", (req, res) => {
    const id_user = req.params.id_user;
    const sqlSelectLaporanChatById = "SELECT user.nama, laporanchat.tanggal, laporanchat.chat_masuk, laporanchat.chat_closing FROM laporanchat INNER JOIN user ON laporanchat.id_user=user.id_user WHERE laporanchat.id_user = ?";
    db.query(sqlSelectLaporanChatById, id_user, (err, result) => {
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

app.delete("/api/delete/laporanChat/:id_laporan", (req, res) => {
    const id_laporan = req.params.id_laporan;
    const sqlDeleteLaporanChat = "DELETE FROM laporanchat WHERE id_laporan = ?";
    db.query(sqlDeleteLaporanChat, id_laporan, (err, result) => {
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

app.put("/api/update/laporanChat", (req, res) => {
    const id_laporan = req.body.id_laporan;
    const chat_masuk = req.body.chat_masuk;
    const chat_closing = req.body.chat_closing;
    const sqlUpdateLaporanChat = "UPDATE laporanchat SET chat_masuk = ?, chat_closing = ? WHERE id_laporan = ?";
    backURL = req.header('Referer') || '/';
    db.query(sqlUpdateLaporanChat, [chat_masuk, chat_closing, id_laporan], (err, result) => {
        res.redirect("/");
    });
});

app.listen(3001, () => {
    console.log("running on port 3001");
});