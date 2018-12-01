const axios = require("axios");
const server = "https://polar-inlet-56421.herokuapp.com";

const { fillBlogContent } = require("./render");
const { newPostHandler } = require("./build-post");
function main() {
  const newPost = document.getElementById("new-post");

  newPost.addEventListener("click", newPostHandler);

  getAll();
}

function getAll(size, start) {
  axios.get("https://polar-inlet-56421.herokuapp.com/posts")
    .then(function (res) {
      fillBlogContent(res.data.data);
    })
    .catch(function(err) {
      console.log(err)
    });
}

document.addEventListener("DOMContentLoaded", main);
