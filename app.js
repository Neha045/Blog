const bodyParser = require("body-parser"),
expressSanitizer = require("express-sanitizer"),	  
methodOverride   = require("method-override"),
mongoose         = require("mongoose"),	
express          = require("express"),
app              = express();

// APP CONFIG
mongoose.connect("mongodb://localhost/blog_app", {useNewUrlParser: true});
app.set("view engine" , "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride("_method"));
app.use(expressSanitizer());
// MONGOSE/MODEL CONFIG 
var blogSchema = new mongoose.Schema({
	title: String,
	image: String,
	body: String,
	created: {type: Date, default: Date.now}
});
var Blog = mongoose.model("Blog", blogSchema);

// RESTFUL ROUTES
app.get("/", (req,res) =>{
	res.redirect("/blogs")
});
// INDEX route
app.get("/blogs", (req, res) =>{
	Blog.find({}, (err, blog) =>{
	if(err){
		console.log("error!");
	}else{
		res.render("index", {blog: blog});
	}	
	});
});
// NEW route
app.get("/blogs/new", (req, res) =>{
	res.render("new")
})
// CREATE route
app.post("/blogs", (req, res) =>{
	//cerate blog
	req.body.blog.body = req.sanitize(req.body.blog.body);
	Blog.create(req.body.blog, function(err, newBlog){
		if(err){
			res.render("new");
		}else{
		//then, redirect it to the index	
			res.redirect("/blogs");
		}
	});
})

// SHOW route
app.get("/blogs/:id", (req, res) =>{
	Blog.findById(req.params.id, function(err, foundBlog){
		if(err){
			res.redirect("/blogs");
		}else{
			res.render("show", {blog: foundBlog});
		}
	})
});

//EDIT Route
app.get("/blogs/:id/edit", (req, res) =>{
	Blog.findById(req.params.id, function(err, foundBlog){
		if(err){
			res.redirect("/blogs")
		}else{
			res.render("edit", {blog: foundBlog});	
		}
	})
});

//UPDATE Route
app.put("/blogs/:id", (req,res) =>{
	req.body.blog.body = req.sanitize(req.body.blog.body);
	Blog.findByIdAndUpdate(req.params.id, req.body.blog, function(err, updatedBlog){
		if(err){
			res.redirect("/blogs")
		}else{
			res.redirect("/blogs/" + req.params.id);
		}
	})
});

//DELETE Route
app.delete("/blogs/:id", (req, res) =>{
	//destroy blogs
	Blog.findByIdAndRemove(req.params.id, function(err){
		if(err){
			res.redirect("/blogs");
		}else{
			//redirect somewhere
			res.redirect("/blogs");
		}
	})
});

app.listen(3000, function(){
	console.log("Server Started");
})