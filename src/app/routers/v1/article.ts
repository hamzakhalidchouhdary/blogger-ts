import { Router } from "express";
const HTTP_STATUS = require("../../../utils/constants/httpStatus");
const router = require("express").Router();
const ArticlePostService = require("../../apis/articlePostService");
const ArticleValidation = require("./middleware/validations/articles");

router.post("/", ArticleValidation.newArticle, ArticlePostService.createPost);
router.put(
  "/:id",
  ArticleValidation.updateArticle,
  ArticlePostService.updatePost
);
router.get("/list", ArticlePostService.getPosts);
router.get("/:id", ArticlePostService.getPost);
router.delete("/:id", ArticlePostService.deletePost);

module.exports = router;
