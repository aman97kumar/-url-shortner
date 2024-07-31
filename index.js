const express = require("express");
const {connectToMongoDB} = require("./connect")
const path = require("path")
const urlRoute = require("./routes/url")
const staticRoute = require("./routes/staticRouter")
const URL = require("./models/url")

const app = express();
const PORT = 8001;

connectToMongoDB("mongodb://localhost:27017/short-url").then(() =>
    console.log("MongoDB Connected")
);


app.set('view engine', 'ejs')
app.set('views', path.resolve('./views'))

app.use(express.json());
app.use(express.urlencoded({ extended: false }));



//server side rendering
// app.get("/test",async(req,res) =>{
//     const allUrls = await URL.find({});
//     //you can also send objects
//     return res.render("home" , {
//         urls:allUrls,
//     })
// })


app.use("/",staticRoute);

app.use("/url",urlRoute);

app.get("/url/:shortId",async (req,res) =>{
    const shortId = req.params.shortId;
    const entry = await URL.findOneAndUpdate({
        shortId,
    },

    {
    $push :{
        visitHistory : {
            timestamp : Date.now()
        },
    },
    }
);
res.redirect(entry.redirectURL);

})

app.listen(PORT,()=>{
    console.log(`Server started at Port number ${PORT}`);
});