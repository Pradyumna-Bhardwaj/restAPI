const User = require("../models/user");

async function handleGetAllUsers(req, res) {
    const allDBUsers = await User.find({});
    return res.json(allDBUsers);    
}

async function handleGetUserById(req, res) {
    const user = await User.findById(req.params.id);
        if(!user){return res.status(404).json({error:'user not found'})};
        // res.setHeader("X-myName", "Rahul"); // Custom headers are set with X in front of their names
        return res.json(user);
}

async function handleUpdateUserById(req, res) {
    const user = await User.findByIdAndUpdate(req.params.id, {last_name: "Changed. Take in put from frontend"});
    return res.json({status: "Suceessfully changed"});
}

async function handleDeleteUserById(req, res) {
    const user = await User.findByIdAndDelete(req.params.id)
    return res.json({status: `Successfully deleted ${user.first_name} ${user.last_name}`});    
}

async function handleCreateNewUser(req, res) {
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
    return res.status(201).json({msg: "success", id: result._id});    
}

module.exports = {
    handleGetAllUsers,
    handleGetUserById,
    handleUpdateUserById,
    handleDeleteUserById,
    handleCreateNewUser,
}