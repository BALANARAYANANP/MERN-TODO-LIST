
const express = require('express')
const app = express();
const mongoose = require('mongoose')
const cors = require('cors')
app.use(express.json())
app.use(cors())

app.get('/', (req, res) => {
    res.send("Hello World")
})

// let todos = []

mongoose.connect('mongodb://localhost:27017/mern')
    .then(() => {
        console.log("DB CONNECTED")
    })
    .catch((err) => {
        console.log(err)
    })

//Schema

const todoSchema = new mongoose.Schema({
    title: {

        required: true,
        type: String
    },
    desc: String
})


// model

const todomodel = mongoose.model('Todo', todoSchema)


app.post('/todos', async (req, res) => {
    const { title, desc } = req.body
    //    const newtodo = { 
    //     id:todos.length + 1,
    //     title,
    //     desc
    //    };
    //    todos.push(newtodo)
    //    console.log(todos)
    try {
        const newTodo = new todomodel({ title, desc });
        await newTodo.save()
        res.status(201).json(newTodo)
    }
    catch (err) {
        console.log(err)
        res.status(500).json({ message: err.message })
    }

})

// Get API

app.get('/todos', async (req, res) => {
    try {
        const todos = await todomodel.find();
        res.json(todos)
    }
    catch (err) {
        console.log(err)
        res.status(500).json({ message: err.message })
    }
})

// GET Single Item Api
app.get('/todos/:id', async (req, res) => {
    try {
        const id = req.params.id
        const FindSingleItem = await todomodel.findById(id)
        res.json(FindSingleItem)
    }
    catch (error) {
        console.log(error)
        res.status(500).json({ message: error.message })

    }
})
// Update Todo ITEM


app.put('/todos/:id', async (req, res) => {
    try {
        const id = req.params.id
        const { title, desc } = req.body
        const Updatedtodo = await todomodel.findByIdAndUpdate(
            id,
            { title, desc },
            { new: true },
        )

        if (!Updatedtodo) {
            return res.status(404).json({ message: "Item Not Found" })
        }
        else {
            res.json(Updatedtodo)
        }

    } catch (error) {
        console.log(error)
        res.status(500).json({ message: error.message })

    }


})

// DELETE API

app.delete('/todos/:id', async (req, res) => {
    try {
        const id = req.params.id
        // const {title, desc} = req.body
        const DeleteItem = await todomodel.findByIdAndDelete(id)
        res.status(204).end()
        if (!DeleteItem) {
            res.status(404).json({ message: "Item Not Found " })
        }
        // else{
        //     res.json(DeleteItem)
        // }
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: error.Message })
    }
})

const port = 8000

app.listen(port, () => {
    console.log("Server Is Listening Port", +port)
})