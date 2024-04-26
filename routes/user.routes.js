import express from "express"
import { UserLogout, deleteUser, updateUser, userCreate, userLogin, userProfile } from "../controller/user.controller.js";
import { IsAuthenticat } from "../middleware/auth.middleware.js";

const routes = express.Router();

routes.post("/register", userCreate);
routes.post("/login", userLogin);

routes.get("/profile", IsAuthenticat, userProfile);
routes.get("/logout", UserLogout);

routes.put("/update/:id",IsAuthenticat, updateUser);
routes.delete("/delete/:id", IsAuthenticat, deleteUser);

export default routes;

