import Path from "../Models/pathModel.js";
import { updateOne, getOne, getAll, deleteOne, createOne } from "./centralController.js";

export const createOnePath = createOne(Path);
