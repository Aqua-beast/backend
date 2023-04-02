//used to store all routes used in project

const express = require('express');
const Article = require('./../models/article')
const router = express.Router();
//this will give us a router that will be used to load different views

router.get('/new', (req, res)=>{
    res.render("articles/new", { article: new Article() });
})

router.get('/edit/:id', async (req, res) => {
    const article = await Article.findById(req.params.id)
    res.render('articles/edit', { article: article })
    // when you want to prepopulate field, you can just use {article} instead of {article: article} using object destructuring
})

router.get('/:slug', async(req, res) =>{
    const article = await Article.findOne({ slug: req.params.slug });
    // in case of id, we don't have to mention parameter that is like slug 

    if (article == null) res.redirect('/')
    res.render("articles/show", { article: article });
})

router.post('/', async (req, res, next) => {
    req.article = new Article()
    next()
  }, saveArticleAndRedirect('new'))
  
  router.put('/:id', async (req, res, next) => {
    req.article = await Article.findById(req.params.id)
    next()
  }, saveArticleAndRedirect('edit'))
  
  router.delete('/:id', async (req, res) => {
    await Article.findByIdAndDelete(req.params.id)
    res.redirect('/')
  })
  
  // since the post and put request have same functionalities hence, they are grouped together
  function saveArticleAndRedirect(path) {
    return async (req, res) => {
      let article = req.article
      article.title = req.body.title
      article.description = req.body.description
      article.markdown = req.body.markdown
      try {
        article = await article.save()
        res.redirect(`/articles/${article.slug}`)
      } catch (e) {
        res.render(`articles/${path}`, { article: article })
      }
    }
  }

module.exports = router
