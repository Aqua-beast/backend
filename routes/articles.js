const express = require('express');
const Article = require('./../models/article');
const router = express.Router();

router.get('/new', (req, res)=>{
    res.render('articles/new', { article: new Article() });
    // this thing is added because if we have loaded the page from scratch then it would have caused a error as there would have been no article object to load from
}) 

router.get('/:id', async (req, res)=>{
    const article = await Article.findById(req.params.id);
    if(article == null) res.redirect('/');
    res.render('articles/show', { articles: article })
})

router.post('/', async (req, res) => {
    /*Async functions can contain zero or more await expressions. Await expressions make promise-returning functions behave as though they're synchronous by suspending execution until the returned promise is fulfilled or rejected. The resolved value of the promise is treated as the return value of the await expression. Use of async and await enables the use of ordinary try / catch blocks around asynchronous code.*/
    let article = new Article({
        title: req.body.title,
        desciption: req.body.desciption,
        markdown: req.body.markdown,
    })
    try { 
        article = await article.save();
        res.redirect(`/articles/${article.id}`)
        // ``- backticks and $ - string interpolation
    }catch (e){
        res.render('articles/new', {article: article})
    }
})

module.exports = router