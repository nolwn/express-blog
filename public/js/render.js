// const axios = require("axios");
// const {
//   closeHandler,
//   cancelEditHandler,
//   deleteHandler,
//   submitEditHandler,
//   editHandler,
//   postHandler,
//   newPostHandler
// } = require("./handlers");
//
// const {
//   createButtons,
//   addLabels,
//   appendChildren,
//   clearChildren
// } = require("./utils");

const { buildPost } = require("./build-post");

const blogContent = document.getElementById("blog-content");

// const server = "https://polar-inlet-56421.herokuapp.com";


// Drops in each blog post
function fillBlogContent(data) {
  data.reverse().forEach(post => {
    blogContent.appendChild(buildPost(post));
  });
}

module.exports = { fillBlogContent };
