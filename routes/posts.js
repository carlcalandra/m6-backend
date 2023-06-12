import { Router } from "express";
import BlogModel from "../models/BlogModel.js";
import { params, validator } from "../middlewares/validator.js";
import AuthorModel from "../models/AuthorModel.js";
import parser from "../middlewares/multer.js";
import trasporter from "../email/nodemailer.js";

const blogRouter = Router();

blogRouter.get("/", async (req, res, next) => {
  try {
    const { itemsPerPage = 5 } = req.query;
    const { pageNumber = 0 } = req.query;
    const blogPosts = await BlogModel.find()
      .limit(itemsPerPage)
      .skip(itemsPerPage * pageNumber)
      .populate("author");
    const totalCount = await BlogModel.count();
    const totalPages = Math.ceil(totalCount / itemsPerPage);
    res.status(200).send({
      itemsPerPage: itemsPerPage,
      pageNumber: pageNumber,
      totalPages: totalPages,
      posts: blogPosts,
    });
  } catch (error) {
    next(error);
  }
});

blogRouter.get("/blogPosts", async (req, res, next) => {
  try {
    const { title } = req.query;
    const blogPost = await BlogModel.findOne({
      title: { $regex: title },
    });
    res.status(200).json(blogPost);
  } catch (error) {
    next(error);
  }
});

blogRouter.get("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const blogPost = await BlogModel.findById(id).populate(["author", {path:"comments", populate:{path:"author", model:"Author"}}]);
    if (!blogPost) {
      res.status(404).send({ message: "Resource not found" });
    }
    res.status(200).send(blogPost);
  } catch (error) {
    next(error);
  }
});

blogRouter.post("/", params, validator, async (req, res, next) => {
  try {
    const author = await AuthorModel.findOne({ email: req.body.author.email });
    if (!author) {
      return res.status(404).json({ message: "author not found" });
    }
    const data = { ...req.body, author: author };
    const blogPost = new BlogModel(data);
    await blogPost.save();
    author.posts.push(blogPost);
    await author.save();
    await trasporter.sendMail({
      to: author.email,
      subject: `New post created - ${blogPost.title}`,
      text: "Your post was published",
    });
    return res.status(201).send(blogPost);
  } catch (error) {
    next(error);
  }
});

blogRouter.put("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const blogPost = await BlogModel.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    if (!blogPost) {
      return res.status(404).send({ message: "Resource not found" });
    }
    return res.status(200).send(blogPost);
  } catch (error) {
    next(error);
  }
});

blogRouter.patch(
  "/:id/cover",
  parser.single("coverImg"),
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const blogPost = await BlogModel.findByIdAndUpdate(id, {
        cover: req.file.path,
      });
      res.status(200).json(blogPost);
    } catch (error) {
      next(error);
    }
  }
);

blogRouter.delete("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const blogPost = await BlogModel.findByIdAndDelete(id);
    if (!blogPost) {
      return res.status(404).send({ message: "Resource not found" });
    }
    res.send(204).end();
  } catch (error) {
    next(error);
  }
});

blogRouter.get("/:id/comments", async (req, res, next) => {
  try {
    const { id } = req.params;
    const post = await BlogModel.findById(id);
    return res.status(200).json(post.comments);
  } catch (error) {
    next(error);
  }
});

blogRouter.post("/:id/comments", async (req, res, next) => {
  try {
    const { id } = req.params;
    const post = await BlogModel.findById(id);
    post.comments.push(req.body);
    await post.save()
    return res.status(200).json(post.comments);
  } catch (error) {
    next(error);
  }
});

blogRouter.get("/:id/comments/:commentId", async (req, res, next) => {
  try {
    const { id, commentId } = req.params;
    const post = await BlogModel.findById(id);
    const comment = post.comments.id(commentId)
    return res.status(200).json(comment);
  } catch (error) {
    next(error);
  }
});

blogRouter.put("/:id/comments/:commentId", async (req, res, next) => {
  try {
    const { id, commentId } = req.params;
    const post = await BlogModel.findById(id);
    const comment = post.comments.id(commentId);
    const index = post.comments.indexOf(comment);
    if (index === -1) {
      res.status(404).json({message:"Not found"})
    }
    post.comments.set(index, {...req.body, _id:commentId})
    await post.save()
    return res.status(200).json(post);
  } catch (error) {
    next(error);
  }
});

blogRouter.delete("/:id/comments/:commentId", async (req, res, next) => {
  try {
    const { id, commentId } = req.params;
    const post = await BlogModel.findById(id);
    post.comments.id(commentId).deleteOne()
    await post.save()
    return res.status(200).json(post);
  } catch (error) {
    next(error);
  }
});



export default blogRouter;
