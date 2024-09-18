const express = require("express");
const {handleGetAllUsers,handleGetUserById,handleUpdateUserById,handleDeleteUserById,handleCreateNewUser} = require("../controllers/user")
const User = require("../models/user")
const router = express.Router();

//html SSR (Server Side Rendering)
// router.get("/", async (req,res)=>{
//     const allDBUsers = await User.find({});
//     const html = `
//     <ul>
//         ${allDBUsers.map((user) => `<li>${user.first_name} - ${user.email}</li>`).join("")}
//     </ul>
//     `;
//     res.send(html);
// })


router
    .route("/")
    .get(handleGetAllUsers)
    .post(handleCreateNewUser)
    
router                             //if on same URL multiple routes have to be created do this
    .route("/:id")
    .get(handleGetUserById)
    .patch(handleUpdateUserById)
    .delete(handleDeleteUserById)

module.exports = router;