const express = require('express');
const router = express.Router();
const Article = require('../models/articles');
const articles = require('../models/articles');
const { findByIdAndDelete } = require('../models/articles');
// const articles = require('../models/articles');




router.get('/new',(req,res)=>{
    res.render('articles/new',{article:{}})
});         

//Now Edit an article
router.get('/edit/:id',async(req,res)=>{
    const article =await Article.findById(req.params.id)
    res.render('articles/edit',{article:article});

});

router.put('/:id',async(req,res,next)=>{
    const article =await Article.findById(req.params.id)
    req.article=article
    next()
},saveArticleAndRedirect('edit'))





// router.get('/:id',async(req,res)=>  /* url e id pathaye get korar chaite slug pathaiye db theke related slug bishishto object retreive korbo */ {
  
router.get('/:slug',async(req,res)=>{
    const article = await Article.findOne({slug:req.params.slug});
    if(article==null) res.redirect('/')
    // res.render('/articles/show')  ==> /article hobe na, only article/show hobe
    res.render('articles/show',{article:article})
}) 



router.post('/', async (req,res,next)=>{
    req.article = new Article()
    next();
},saveArticleAndRedirect('new'))

//Ekhon amara ekta object delete korte chacchi .But url diye shudhu GET kora jay. And, Form diye shudhu POST kora jay.
//In order to use DELETE as a method from our form, we need to use a library called 'method-override'[find that in server.js]. It allows us to override the method that the form passes. So instead of being get stuck with GET and POST, we can do DELETE/PATCH/PUT



router.delete('/:id',async(req,res)=>{
    await Article.findByIdAndDelete(req.params.id)
    res.redirect('/')
})

function saveArticleAndRedirect(path) {
    return  async(req,res)=>{
        let article = req.article   // new artcle creation ==> LHS = null
                                    // edit extisting article ==> LHS= unedited article
           article.title=req.body.title,
           article.description=req.body.description,
           article.markdown=req.body.markdown
        
        try{
         article =  await article.save();    
         res.redirect(`/articles/${article.slug}`)
        }
        catch(e){
            // console.log(e)
            res.render(`articles/${path}`,{article:article})
        }
      }
    }

module.exports= router;
