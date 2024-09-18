const { error } = require("console");
const express = require("express");
const fs = require("fs");
const mongoose = require("mongoose");
PORT = 8000;

app = express();

//MongoDB connection
mongoose.connect('mongodb://127.0.0.1:27017/restAPI_DB')
.then(() => console.log('MongoDB connected'))
.catch((err) => console.log('Mongo Error'));

//Schema
const userSchema = new mongoose.Schema({
    first_name: {
        type: String,
        required: true,
    },
    last_name: {
        type: String,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    job_title: {
        type: String,
    },
    gender : {
        type: String
    },
},
{timestamps: true}
);

//making model with the schema. 1st parameter = name of model
const User = mongoose.model('user', userSchema); 


//middleware
app.use(express.urlencoded({ extended: false}));

//Keeping log
app.use((req, res, next)=>{
    fs.appendFile(
        "log.txt",
        `\n${Date.now()}: ${req.method}: ${req.path}`,
        (err, data)=>{
            next();
        }
    );
});

//html SSR (Server Side Rendering)
app.get("/users", async (req,res)=>{
    const allDBUsers = await User.find({});
    const html = `
    <ul>
        ${allDBUsers.map((user) => `<li>${user.first_name} - ${user.email}</li>`).join("")}
    </ul>
    `;
    res.send(html);
})

//returning jsons

app.get("/api/users", async (req,res) => {
    const allDBUsers = await User.find({});
    return res.json(allDBUsers);
});
app                             //if on same URL multiple routes have to be created do this
    .route("/api/users/:id")
    .get( async (req,res)=>{
        const user = await User.findById(req.params.id);
        if(!user){return res.status(404).json({error:'user not found'})};
        // res.setHeader("X-myName", "Rahul"); // Custom headers are set with X in front of their names
        return res.json(user);
    })
    .patch(async (req, res)=>{
        const user = await User.findByIdAndUpdate(req.params.id, {last_name: "Changed. Take in put from frontend"});
        return res.json({status: "Suceessfully changed"});
    })
    .delete(async(req, res)=>{
        const user = await User.findByIdAndDelete(req.params.id)
        return res.json({status: `Successfully deleted ${user.first_name} ${user.last_name}`});
    })


app.post("/api/users", async (req, res)=>{
    const body = req.body;
    
    if(!body || !body.first_name ||!body.last_name ||!body.email ||!body.gender||!body.job_title){
        return res.status(400).json({msg: "All entry fields not filled"})
    };

    //Appending in Mongo DB
    const result = await User.create({
        first_name : body.first_name,
        last_name : body.last_name,
        email : body.email,
        gender : body.gender,
        job_title : body.job_title,
    });
    console.log(result);
    return res.status(201).json({msg: "success"});
});


app.listen(PORT, () => console.log("Server Started"));
