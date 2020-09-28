const express = require('express');
const app = express();
const methodOverride = require('method-override')
const articleRouter = require('./router/articles')
const Article = require('./models/articles')
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/Blog',
{ useUnifiedTopology: true , useNewUrlParser: true,useCreateIndex:true })

app.set('views','./views');
app.set('view engine', 'ejs');

app.use(express.urlencoded({extended:false})) //er por theke 'req' er vitor 'body' pawa jabe.
app.use(methodOverride('_method')); //Whenever we set this '_method' to DELETE in a form, it is gonna overrride the POST method of that form to DELETE. Notice:Dont use a an anchor tag. Becoz, google crawler will treat that as a GET,and everytime it crawls our site ,it will keep deleting objects using that url 
app.use('/articles',articleRouter)

app.get('/',async(req,res)=>{
    const articles= await Article.find().sort({date:'desc'})
   res.render('articles/index',{articles:articles});

})
const port = process.env.PORT || 2000;

app.listen(port,()=>{console.log(`Listening on port ${port}`)});