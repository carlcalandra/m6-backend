import { Router } from "express";
import AuthorModel from "../models/AuthorModel.js";
import parser from "../middlewares/multer.js";

const authorRouter = Router();

authorRouter.get("/", async (req, res, next)=>{
    try{
        const authors = await AuthorModel.find();
        return res.status(200).send(authors);
    } catch(error) {
        next(error);
    }
})

authorRouter.get("/:id", async (req, res, next)=>{
    try{
        const {id} = req.params; 
        const author = await AuthorModel.findById(id);
        return res.status(200).send(author);
    } catch(error) {
        next(error);
    }
})

authorRouter.get("/:id/blogPosts", async (req, res, next)=>{
    try{
        const {id} = req.params; 
        const author = await AuthorModel.findById(id).populate("posts");
        return res.status(200).send(author.posts);
    } catch(error) {
        next(error);
    }
})

authorRouter.put("/:id", async (req, res, next) => {
    try {
        const {id} = req.params;
        const author = await AuthorModel.findByIdAndUpdate(id,req.body, {new:true});
        if (!author) {
            return res.status(404).send({message:"Resource not found"})
        }
        return res.status(201).send(author);
    } catch (error) {
        next(error);
    }
})

authorRouter.delete("/:id", async (req, res, next) => {
    try {
        const {id} = req.params;
        const author = await AuthorModel.findByIdAndDelete(id);
        if (!author) {
            return res.status(404).send({message:"Resource not found"})
        }
        return res.status(204).end();
    } catch (error) {
        next(error);
    }
})

authorRouter.patch(
    "/:id/cover",
    parser.single("avatarImg"),
    async (req, res, next) => {
      try {
        const { id } = req.params;
        const blogPost = await AuthorModel.findByIdAndUpdate(id, {
          avatar: req.file.path,
        });
        res.status(200).json(blogPost);
      } catch (error) {
        next(error);
      }
    }
  );


export default authorRouter;