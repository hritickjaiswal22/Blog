const Article = require("../models/Article");

module.exports = {
  addArticlle: (req, res, next) => {
    let { text, title, claps, description } = req.body;

    function saveArticle(obj) {
      new Article(obj).save((error, article) => {
        if (error) {
          res.send(error);
        } else if (!article) {
          res.send(400);
        } else {
          return article.addAuthor(req.body.author_id).then((_article) => {
            return res.send(_article);
          });
        }
        next();
      });
    }

    saveArticle({ text, title, claps, description, feature_img: "" });
  },
  getAll: (req, res, next) => {
    Article.find(req.params.id)
      .populate("author")
      .populate("comments.author")
      .exec((error, article) => {
        if (error) {
          res.send(error);
        } else if (!article) {
          res.send(404);
        } else {
          res.send(article);
        }
        next();
      });
  },
  clapArticle: (req, res, next) => {
    Article.findById(req.body.article_id)
      .then((article) => {
        return article.clap().then(() => {
          return res.json({ msg: "Done" });
        });
      })
      .catch(next);
  },
  commentArticle: (req, res, next) => {
    Article.findById(req.body.article_id)
      .then((article) => {
        return article
          .comment({
            author: req.body.author_id,
            text: req.body.comment,
          })
          .then(() => {
            return res.json({ msg: "Done" });
          });
      })
      .catch(next);
  },
  getArticle: (req, res, next) => {
    Article.findById(req.params.id)
      .populate("author")
      .populate("comments.author")
      .exec((err, article) => {
        if (err) res.send(err);
        else if (!article) res.send(404);
        else res.send(article);
        next();
      });
  },
};
