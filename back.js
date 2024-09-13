const express = require('express');
const jwt = require('jsonwebtoken')
const app = express();
const JWT_SECRET = 'kjdsbvkhbvksdj';
const { v4: uuidv4 } = require('uuid');
app.use(express.json());

let todos = [];

let users = [];
app.get('/',function(req,res){
    res.sendFile("/Users/priyanshudeswal/Desktop/todofull/public/index.html");
})
app.get('/dashboard.html',function(req,res){
    res.sendFile("/Users/priyanshudeswal/Desktop/todofull/public/dashboard.html");
})
app.get('/existing.html',function(req,res){
    res.sendFile("/Users/priyanshudeswal/Desktop/todofull/public/existing.html")
})

app.post('/signup',function(req,res){
    const username = req.body.username;
    const password = req.body.password;
    users.push({
        username : username,
        password : password
    })
    res.json({
        message : "Your account has been created"
    })

})

app.post('/signin',function(req,res){
    const username = req.body.username;
    const password = req.body.password;
    foundUser = null;
    for(let i=0;i<users.length;i++){
        if(users[i].username == username && users[i].password == password){
           foundUser = users[i];
           break;
        }
        
    }
    if(foundUser){
        const token = jwt.sign({
            username : foundUser.username
        },JWT_SECRET)
        res.json({
            token : token
        })
    }
    else{
        res.status(404);
    }



})
function auth(req, res, next) {
    const token = req.headers.token;
    
   
    try {
        const decInfo = jwt.verify(token, JWT_SECRET);

        
        let foundUser = null;
        for (let i = 0; i < users.length; i++) {
            if (users[i].username === decInfo.username) {
                foundUser = users[i];
                break;
            }
        }

       
        if (foundUser) {
            req.name = decInfo.username
            next();
        } else {
            
            return res.status(404).json({ message: 'User not found' });
        }

    } catch (error) {
        
        return res.status(401).json({ message: 'Invalid token' });
    }
}

app.post('/create',auth,function(req,res){
    const tod = req.body.tod;
    const todo = {
        task : tod,
        
        status : false
    }

    todos.push(todo);

    res.json({
        message : 'new todo added'
    })

})

app.get('/existing', auth, function(req, res) {
    let exTodos = [];
    
    
    for (let i = 0; i < todos.length; i++) {
        exTodos.push({
            task: todos[i].task,    
            status: todos[i].status 
        });
    }

    res.json({
        todos: exTodos   
    });
});



app.post('/delete',auth,function(req,res){
    const todooo = req.body.todooo;
    let findindex = -1;
    for(let i = 0;i<todos.length;i++){
        if(todos[i].task == todooo){
           findindex = i;
           break;
        }

    }
    todos.splice(findindex,1);
    res.json({
        message : "Deletion done!"
    })
})

app.post('/done',auth,function(req,res){
    const todo = req.body.todo;
    for(let i=0;i<todos.length;i++){
        if(todos[i].task == todo){
            todos[i].status = true;
        }
    }
    res.json({
        message : "Congratulations!!"
    })
    
})
app.get('/user',auth,function(req,res){
    res.json({
        name : req.name
    })
})
app.listen(4000)
