const { error } = require("console");
const express = require("express");
const fs = require("fs");
const _ = require('lodash')     //to introduce _.pullAt() method
const mongoose = require("mongoose");
PORT = 8000;
users = require("./MOCK_DATA.json");

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

//making model with the schema
const User = mongoose.model('user', userSchema);


//middleware
app.use(express.urlencoded({ extended: false}));

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
// app.get("/users", (req,res)=>{
//     const html = `
//     <ul>
//         ${users.map((user) => `<li>${user.first_name}</li>`).join("")}
//     </ul>
//     `;
//     res.send(html);
// })

//returning jsons

app.get("/api/users", (req,res) => {
    return res.json(users);
});
app                             //if on same URL multiple routes have to be created do this
    .route("/api/users/:id")
    .get((req,res)=>{
        const id = Number(req.params.id); //converting string id to numerical
        const user = users.find((user) => user.id === id);
        if(!user){return res.status(404).json({error:'user not found'})};
        res.setHeader("X-myName", "Rahul"); // Custom headers are set with X in front of their names
        return res.json(user);
    })
    .patch((req, res)=>{
        const body = req.body;
        const id = Number(req.params.id);
        const user = users.find((user) => user.id === id);//user found

        user_updation(user);
        
        // updating user
        function user_updation(user){
        user.first_name = body.first_name;
        user.last_name = body.last_name;
        user.email = body.email;
        user.gender = body.gender;
        user.job_title = body.job_title;
        };

        // updating DB
        fs.writeFile("./MOCK_DATA.json", JSON.stringify(users), (err, data) => {     //stringify = converting object to string
            return res.json({status:`success user ${id} updated`});
        });
    })
    .delete((req, res)=>{
        const id = Number(req.params.id);
        const user = users.find((user) => user.id === id);

        user_deletion(user);

        function user_deletion(user){
            user.first_name = null;
            user.last_name = null;
            user.email = null;
            user.gender = null;
            user.job_title = null;
            };
        //_.pullAt(users, [id-1]);

        // updating DB
        fs.writeFile("./MOCK_DATA.json", JSON.stringify(users), (err, data) => {     //stringify = converting object to string
            return res.json({status:`Success, user ${id} deleted`});
        });
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

    //.JSON file DB
    // users.push({ 
    //     id: users.length + 1,
    //     first_name: body.first_name,
    //     last_name: body.last_name,
    //     email: body.email,
    //     gender: body.gender,
    //     job_title: body.job_title
    // })
    // fs.writeFile("./MOCK_DATA.json", JSON.stringify(users), (err, data) => {     //stringify = converting object to string
    //     return res.json({status: "success", id: users.length});
    // });
});


app.listen(PORT, () => console.log("Server Started"));
