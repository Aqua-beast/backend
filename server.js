const express = require('express');
const mongoose = require('mongoose');
const articlesRouter = require('./routes/articles');
const app = express();

mongoose.connect('mongodb://localhost/blog', {useNewUrlParser: true, useUnifiedTopology: true});


app.set('view engine', 'ejs');

app.use(express.urlencoded({extended: false}))
// this means that we can access anything in our forms parameter in post request instead of using body-parser by using syntax: req.body.title, req.body.description

app.use('/articles', articlesRouter);

app.get('/', async (req, res)=>{
    const articles = await article.find().sort({createdAt: 'desc' })
    res.render('articles/index', {articles: articles});
})

app.listen(5000, function(){
    console.log("server is up running at port 5000");
})
