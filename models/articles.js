const mongoose = require('mongoose');

//'marked' ==> allows us to create markdown and turn it into html
//'slugify'==> allows us to convert something (ie- title) into a url friendly slug that we can use instead of our id in url

const marked = require('marked');
const slugify = require('slugify');

//We wanna convert our blog markdown to html.Then sanitize the html sothat malicious codes are not added to this.
const createDomPurify = require('dompurify'); //allows us to sanitize the html
const {JSDOM} = require('jsdom');  //allows to render html inside nodejs.Bcoz nodejs doesnt know how html works.

//Now create the dompurifier:
const dompurify = createDomPurify(new JSDOM().window);  // creates HTML and Purify

const articleSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    description:{
        type:String,
    },
    markdown:{
        type:String,
        required:true
    },
    date:{
        type:Date,
        default:Date.now
    },
    slug:{
        type:String,
        required:true,
        unique:true
    },
    sanitizedHTML:{
        type:String,
        required:true,   
    }
})

articleSchema.pre('validate',function (next) {
    if(this.title) this.slug=slugify(this.title,{lower:true, strict:true})
    //marked(this.markdown) ==> converts markdown to html
    //dompurify.sanitize(marked(this.markdown))  ==> sanitizes the html
    if(this.markdown) this.sanitizedHTML=dompurify.sanitize(marked(this.markdown));
    next()
})

module.exports=mongoose.model('Article',articleSchema);