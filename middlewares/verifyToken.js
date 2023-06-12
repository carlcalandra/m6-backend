import jwt from "jsonwebtoken";

const verifyToken = (req, res, next) => {
  try {
    const token = req.headers?.authorization;
    jwt.verify(token, process.env.API_SECRET, (error, decoded) => {
      if (error) {
        return res.status(401).json({message:"Invalid token"})
      }
      next();
    }) 
  } catch (error) {
    next(error);
  }
    
  
};

export default verifyToken;
