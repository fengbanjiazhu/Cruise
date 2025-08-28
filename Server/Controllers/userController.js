import User from "../models/userModel.js";
import { updateOne, getOne, getAll, deleteOne } from "./centralController.js";

export const getAllUsers = getAll(User);
export const getUser = getOne(User);
export const updateUser = updateOne(User);
export const deleteUser = deleteOne(User);
