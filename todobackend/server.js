//Express
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors')

const app = express();
app.use(express.json());
app.use(cors());

// let todos = []
//conneting to mongodb
mongoose.connect('mongodb://localhost:27017/mern-app')
.then(()=>{
    console.log('DB Connected');
})
.catch((err)=>{
    console.log(err);
})
//creating shemma
const todoScemma = new mongoose.Schema({
    title:{
        required:true,
        type:String
    },
    description:String
})

//creating model
const todoModel = mongoose.model('Todo',todoScemma);
//Create New Todo
app.post('/todo', async (req, res) => {
    const { title, description } = req.body;
    // const newTodo = {
    //     id: todos.length + 1,
    //     title,
    //     description
    // };
    // todos.push(newTodo);
    // console.log(todos);
    try {
       const newTodo = new todoModel({title,description});
        await newTodo.save()
        res.status(201).json(newTodo)
    } catch (error) {
        console.log(error);
        res.status(500).json({message:error.message});
    }
})
app.get('/todo', async (req, res) => {
    try {
       const todos =  await todoModel.find();
       res.json(todos)
    } catch (error) {
        console.log(error);
        res.status(500).json({message:error.message});
    }  
})
app.put('/todos/:id', async(req,res)=>{
    try {
        const { title, description } = req.body;
        const id = req.params.id;
        const updateTodo = await todoModel.findByIdAndUpdate(
            id,
            { title,description },
            { new:true }
        )
        if (!updateTodo) {
            return res.status(404).json({message:"Todo Not Found"})
        }
        res.json(updateTodo)    
    } catch (error) {
        console.log(error);
        res.status(500).json({message:error.message});
        
    }
   
});
//Delete A todo items

app.delete('/todos/:id',async (req,res)=>{
       try {
        const id = req.params.id;
        await todoModel.findByIdAndDelete(id);
        res.status(204).end(); 
       } catch (error) {
        console.log(error);
        res.status(500).json({message:error.message});
        
       }

})

const port = 8000;
app.listen(port, () => {
    console.log('Port Is Runing in ' + port);
})