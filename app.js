const express = require("express");

const app = express();

const port = 3000;

const movieRouter = require("./routers/movieRouter")

const notFound = require("./middlewares/notFound");

const errorServer = require("./middlewares/errorServer");

const imagePath = require("./middlewares/imagePath");

const cors = require("cors");

app.use(cors());

app.use(express.json());

app.use(express.static('public'));

app.use(imagePath);

app.get("/api", (req, res) => {
    console.log("hai richiesto la home page");
    res.send('<h1>Home page</h1>')})

app.use("/api/movie", movieRouter)

app.use(errorServer);

app.use(notFound);

app.listen(port, () => {
    console.log(`Il server della porta ${port} è in ascolto`)
})