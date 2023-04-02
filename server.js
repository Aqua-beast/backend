const express = require('express');
const mongoose =  require('mongoose');
const Article = require('./models/article');
const articleRouter = require('./routes/articles');
//this will be used to import route handler to show different views

const methodOverride = require('method-override');

const app = express();

// Replace the connection string with your own MongoDB connection string
// const uri = "mongodb://0.0.0.0:27017/blogs";

const uri = "mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.fzv6xup.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority"
// this is actually the new way to connect to localhost port for db blog with collection as article
// the changes made in the schema have to be done separately to db otherwise the collections will not be stored 
// const uri = "mongodb://0.0.0.0:27017/blogs"

mongoose.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true
//   useCreateIndex: true (this is not supported nowadays)
});
// this is used to remove deprecation warnings

app.set('view engine', 'ejs');

app.use(express.urlencoded({extended: false}))
// this means that we can access all of our form parameters from our article form in our article route

app.use(methodOverride('_method'));

app.get('/', async(req, res) =>{
    const articles =  await Article.find().sort({createdAt: 'desc'});
    res.render('articles/index', {articles: articles});
    // the ejs object variable and custom name are same  
})

app.use('/articles', articleRouter);
//this is a relative path that is any routes enabled using articleRouter, they will be shown after root/article

const server = app.listen(process.env.PORT || 3000, '0.0.0.0', () => {
  console.log(`Server listening on port ${server.address().port}`);
});