const mongoose = require('mongoose');
const {marked} = require('marked');
// this library helps us convert markdown into html files
/* Marked is a Node.js library that allows you to parse Markdown text into HTML. Markdown is a lightweight markup language that uses plain text formatting to convert text into HTML, without the need for complex HTML tags.
With Marked, you can parse Markdown text into HTML on the server-side, allowing you to render the content of Markdown files in your Node.js application. Marked supports a wide range of Markdown syntax, including headers, lists, links, images, code blocks, and more.
*/

const slugify = require('slugify');
// convert title into url friendly title that we can use instead of article id

const createDomPurify = require('dompurify');
// Dompurify is a library that can help prevent XSS (Cross-Site Scripting) attacks by sanitizing HTML input.
/* 
const createDOMPurify = require('dompurify');
const { JSDOM } = require('jsdom');
const window = new JSDOM('').window;
const DOMPurify = createDOMPurify(window);

const userInput = '<script>alert("Hello world");</script>';
const sanitizedInput = DOMPurify.sanitize(userInput);
console.log(sanitizedInput);                                  // Output: ''

In the example above, we're creating a new DOMPurify instance using the JSDOM library, which simulates a browser's Document Object Model (DOM) environment in Node.js. We're then using the sanitize() method to sanitize any user input that contains HTML.

Dompurify is a powerful tool for preventing XSS attacks, but it's important to keep in mind that it is not a replacement for proper input validation and sanitization. It's still important to validate and sanitize input on the server-side to ensure that your application is secure.
*/
const { JSDOM } = require('jsdom');
// {} because we only want JSDOM portion of what it returns
const dompurify = createDomPurify(new JSDOM().window);


const articleSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true 
    },
    description: {
        type: String
    },
    markdown: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
        // it takes a function
        // () => Date.now() we can pass this as a function
        // everytime default will pass this as a function
    },
    slug: {
        type: String,
        required: true,
        unique: true
        // can't have more than one slug as there will be only one page
        // the reason we are storing in db so that we can access them instead of creating again and again
    },
    sanitizedHtml: {
        type: String,
        required: true
    }    
})

articleSchema.pre('validate', function(next){
    if (this.title){
        this.slug = slugify(this.title, {lower: true, strict: true})
        // strict will force our slugify to emit characters that don't fit our url
    }

    if (this.markdown){
        this.sanitizedHtml = dompurify.sanitize(marked(this.markdown))
    }
    next()
})

module.exports = mongoose.model('Article', articleSchema)
// now, we have a table in our database with name Article in it