/* Server side connection */

const express = require('express');
const mysql = require('mysql');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "crud"
})


/* Login authentication */

app.post('/login', (req, res) => {
    const sql = "SELECT * FROM login WHERE email = ? AND password = ?";
    db.query(sql, [req.body.email, req.body.password], (err, data) => {
        if(err) return res.json("Error");
        if(data.length > 0) {

            return res.json({success: true, user: req.body.email, message: "Login successful", redirectUrl: "/home"});
        } else {
            return res.json("No record");
        }
    })
})

app.post('/register', (req, res) => {
    const { email, password } = req.body;
    const sql = "INSERT INTO login (email, password) VALUES (?, ?)";
    db.query(sql, [email, password], (err, result) => {
        if(err) {
            console.error("Error inserting new record:", err);
            return res.json("Error");
        }
        console.log("New record inserted successfully!");
        return res.json({ success: true, message: "Registration successful", redirectUrl: "/login" });
    });
});

/* Server port 8081 */

app.listen(8081, () => {
    console.log("Listening");
})