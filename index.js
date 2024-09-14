const express = require("express");
PORT = 8000;
users = require("./MOCK_DATA.json");

app = express();

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

app.put("/api/users", (req, res)=>{
    return res.json({status:"Pending"});
})


app.listen(PORT, () => console.log("Server Started"));
