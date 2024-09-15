const express = require("express");
const fs = require("fs");

PORT = 8000;
users = require("./MOCK_DATA.json");

app = express();

//middleware
app.use(express.urlencoded({ extended: false}));

//Routes
//html SSR (Server Side Rendering)
app.get("/users", (req,res)=>{
    const html = `
    <ul>
        ${users.map((user) => `<li>${user.first_name}</li>`).join("")}
    </ul>
    `;
    res.send(html);
})

//returning jsons
app.get("/api/users", (req,res) => {
    return res.json(users);
});
app                             //if on same URL multiple routes have to be created do this
    .route("/api/users/:id") 
    .get((req,res)=>{
        const id = Number(req.params.id); //converting string id to numerical
        const user = users.find((user) => user.id === id);
        return res.json(user);
    })
    .patch((req, res)=>{
        return res.json({status:"Pending"});
    })
    .delete((req, res)=>{
        return res.json({status:"Pending"});
    })


app.post("/api/users", (req, res)=>{
    const body = req.body;
    users.push({
        id: users.length + 1,
        first_name: body.first_name,
        last_name: body.last_name,
        email: body.email,
        gender: body.gender,
        job_title: body.job_title
    })
    fs.writeFile("./MOCK_DATA.json", JSON.stringify(users), (err, data) => {     //stringify = converting object to string
        return res.json({status: "success", id: users.length});
    });
});


app.listen(PORT, () => console.log("Server Started"));
