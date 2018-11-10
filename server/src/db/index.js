// npm modules
const fs = require("fs");

function readPosts() {
  return JSON.parse(fs.readFileSync("src/db/posts.json", "utf-8"));
}

function writePosts(updatedPosts) {
  fs.writeFileSync("src/db/posts.json", JSON.stringify(updatedPosts));
}

module.exports = { readPosts, writePosts };
