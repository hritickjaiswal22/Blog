const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const ArticleSchema = new Schema({
  //* Defining the Schema
  text: String,
  title: String,
  description: String,
  feature_img: String,
  claps: { type: Number, default: 0 },
  author: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  comments: [
    {
      author: {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
      text: String,
    },
  ],
});

ArticleSchema.methods.clap = function (data, callbackFunction) {
  this.claps++; //! "this" over here refers to the current Article instance
  return this.save(); //* Using "save" to save changes to the database
};

ArticleSchema.methods.comment = function (comment, callbackFunction) {
  this.comments.push(comment);
  return this.save();
};

ArticleSchema.methods.addAuthor = function (author_id, callbackFunction) {
  this.author = author_id;
  return this.save();
};

ArticleSchema.methods.getUserArticle = function (_id) {
  Article.find({ author: _id })
    .then((articles) => {
      return articles;
    })
    .catch((error) => console.log(error));
};

const Article = new mongoose.model("Article", ArticleSchema); //* Creating a model after providing the schema
//! A "model" represents the entire collection of data inside our databse

module.exports = Article;
