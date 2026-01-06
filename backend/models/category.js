import mongoose from "mongoose";
import { mainDB } from "../config/db.js";
const Schema = mongoose.Schema;

//Schema for categories
const categorySchema = Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    label: {
        type: String,
        required: true
    },
    visual: {
        public_id: {
            type: String,
            default: "",
        },
        url: {
            type: String,
            default: "https://res.cloudinary.com/du1tos77l/image/upload/v1752154036/category_visual/rsnewyqsgh2jd9hwn8ej.jpg"
        }
    },
    description: String
});

const Category = mainDB.model('Category', categorySchema);
export default Category;