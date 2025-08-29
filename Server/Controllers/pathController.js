import Path from "../Models/pathModel.js";
import { updateOne, getOne, getAll, deleteOne, createOne } from "./centralController.js";

// Existing create
export const createOnePath = createOne(Path);
