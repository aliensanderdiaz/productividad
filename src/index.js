require('dotenv').config()

const express = require('express')
const mongoose = require('mongoose');
const cors = require('cors');
const app = express()
const port = process.env.PORT || 3000
const serverless = require("serverless-http");


const router = express.Router();
app.use(express.json())
app.use(cors())

const tareaSchema = new mongoose.Schema({
    dia: Number,
    hora: Number,
    tarea: String
});

const Tarea = mongoose.model('Tarea', tareaSchema);

router.post('/', async (req, res) => {
    let tarea = new Tarea(req.body)
    await tarea.save()
    res.send({ tarea })
})

router.get('/dia/:dia', async (req, res) => {
    let dia = req.params.dia
    console.log({ dia })
    let tareas = await Tarea.find({ dia: +dia })
    res.send({ tareas })
})

app.use(`/.netlify/functions/api`, router);

main().catch(err => console.log(err));

async function main() {
    await mongoose.connect(process.env.DB);
    console.log('Conectado a la base de datos')
    app.listen(port, () => {
        console.log(`Example app listening on port ${port}`)
    })
}

module.exports = app;
module.exports.handler = serverless(app);