const PORT = process.env.PORT || 8000;
const express = require('express')
const app = express()
const pool = require('./db')
const cors = require('cors')
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

app.use(cors())
app.use(express.json())

//test
app.get('/', (req, res) => {
    res.send('hell0 w0rld')
})

//get all todos
app.get('/todos/:userEmail', async (req, res) => {
    const userEmail = req.params.userEmail
    try {
        const todos = await pool.query('SELECT * FROM todos where user_email = $1', [userEmail])
        res.json(todos.rows)
    }
    catch (err) {
        console.error(err)
    }
})

// create a todo
app.post('/todos/', async (req, res) => {
        console.log(req.body);
        const { user_email, title, progress, date } = req.body
        const id = uuidv4()
    try {
        
        const newTodo = await pool.query('INSERT INTO todos (id, user_email, title, progress, date) VALUES ($1, $2, $3, $4, $5)', [id, user_email, title, progress, date])
        res.json(newTodo)
    }
    catch (err) {
        console.error(err)
    }
})

// edit a todo
app.put('/todos/:id', async (req, res) => {
    const { id } = req.params
    const { title, progress, date } = req.body
    try {
        const updateTodo = await pool.query('UPDATE todos SET title = $1, progress = $2, date = $3 WHERE id = $4', [title, progress, date, id])
        res.json(updateTodo)
    }
    catch (err) {
        console.error(err)
    }
})

// delete a todo
app.delete('/todos/:id', async (req, res) => {
    const { id } = req.params
    try {
        const deleteTodo = await pool.query('DELETE FROM todos WHERE id = $1', [id])
        res.json(deleteTodo)
    }
    catch (err) {
        console.error(err)
    }
})

// sign up
app.post('/auth/signup', async (req, res) => {
    const { email, password } = req.body
    const salt = bcrypt.genSaltSync(10)
    const hashedPassword = bcrypt.hashSync(password, salt)
    try {
        const newUser = await pool.query('INSERT INTO users (email, hashed_password) VALUES ($1, $2)', [email, hashedPassword])
        const token = jwt.sign({ email }, 'secret', { expiresIn: '1h' })
        
        res.status(200).json({ 
            token: token,
            email: email  
        })
    }
    catch (err) {
        if (err.code === '23505') {
            res.status(400).json({ message: 'Email already exists' })
        }
        console.error(err)
    }
})

// login
app.post('/auth/login', async (req, res) => {
    const { email, password } = req.body
    try {
        const user = await pool.query('SELECT * FROM users WHERE email = $1', [email])
        if (user.rows.length === 0) {
            res.status(400).json({ message: 'Email does not exist' })
        }
        const isPasswordCorrect = bcrypt.compareSync(password, user.rows[0].hashed_password)
        if (!isPasswordCorrect) {
            res.status(400).json({ message: 'Password is incorrect' })
        } else {
            const token = jwt.sign({ email }, 'secret', { expiresIn: '1h' })
            res.status(200).json({
                token: token,
                email: email
            })
        }
    }
    catch (err) {
        console.error(err)
    }
})

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`)
})

