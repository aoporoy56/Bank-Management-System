const express = require('express');
require("dotenv").config();

const app = express();
const port = 4000;
const cors = require('cors');
const connection = require('./DB/ConDB');
const CustomerRouter = require('./Router/CustomerRoute');
const AdminRouter = require('./Router/AdminRoute');
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

connection();

app.use("/customer",CustomerRouter);
app.use("/admin",AdminRouter);

app.get("/",(req,res)=>{
    res.send("Welcome to the server");
})

app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});

