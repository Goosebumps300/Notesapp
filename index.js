const express = require('express');
const app = express();
const path = require('path');
const fs = require('fs');
// const { render } = require('ejs');

app.set('view engine', 'ejs');
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', function(req, res){
    fs.readdir(`./files`, function(err, files){
        res.render('home', {files: files});
    })
});

app.post('/create', function(req, res){
    if(req.body.task.length > 0 && req.body.taskdetails.length > 0){
        fs.writeFile(`./files/${req.body.task.split(' ').join('')}.txt`, req.body.taskdetails, function(err){
            res.redirect('/');
        })    
    }
    else{
        res.redirect('/');
    }
});

app.get('/files/:filename', function(req, res){
    fs.readFile(`./files/${req.params.filename}`,"utf-8", function(err, filedata){
        res.render('show', {filename: req.params.filename, filedata: filedata});
    });
});

app.get('/edit/:filename', function(req, res){
    res.render('edit', {filename: req.params.filename});
});

app.post('/edit', function(req, res){
    fs.rename(`./files/${req.body.previous}`,`./files/${req.body.new}`, function(err){
        res.redirect('/');
    });
});

app.get('/delete/:filename', function(req, res){
    res.render('del', {filename: req.params.filename});
});

app.post('/delete',function(req, res){
    fs.unlink(`./files/${req.body.deletename}`, function(err){
        res.redirect('/');
    });
});

app.listen(3000);
