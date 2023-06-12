import {body, validationResult} from "express-validator"

const params = [
    body("title").isString().notEmpty().withMessage("Title is required and must be string"),
    body("content").isString().notEmpty().isLength({min:150}).withMessage("Content is required and minimum 150 chars"),
    body("category").notEmpty().isString().withMessage("Category is required and must be string")
]

const validator = (req, res, next) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()})
    }
    next();

}

export {params, validator}