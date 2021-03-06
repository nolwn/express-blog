// npm modules
const uuid = require("uuid/v4");

// My files
const { readPosts, writePosts } = require("../db");

function getAll(size, start = 0) {
  const result = {}
  const error = [];

  const data = readPosts();

  if (parseInt(start) >= data.length) {
    error.push(`There are fewer than ${start} posts!`);
    result.error = error;
  }
  else if (size) {
    result.data = [];

    for (let i = parseInt(start); i < parseInt(size) + parseInt(start); i++) {
      result.data.push(data[i]);
    }
  }
  else {
    result.data = data;
  }

  return result;
}

function getOne(id) {
  const result = {};
  const data = readPosts().find(post => post.id === id);

  if (!data) {
    result.error = [ `A post with the id ${id} could not be found` ];
  }
  else {
    result.data = data;
  }

  return result;
}

function create(data) {
  const result = {};
  const error = [];

  const posts = readPosts();

  if (!data.title) {
    error.push("Posts require a title.");
  }

  if (!data.content) {
    error.push("Posts require content.");
  }

  if (error.length < 1) {
    data.id = uuid();
    posts.push(data);
    writePosts(posts);

    result.data = data;
  }
  else {
    result.error = error;
  }

  return result;
}

function update(id, data) {
  const result = {};
  const error = [];

  const posts = readPosts();
  const index = posts.findIndex(entry => entry.id === id);

  if (index < 0) {
    error.push(`The post you are trying to edit, ${id}, could not be found`);
  }

  if (!data.title) {
    error.push("Posts require a title.");
  }

  if (!data.content) {
    error.push("Posts require content");
  }

  if (error.length < 1) {
    data.id = id;
    posts[index] = data;
    writePosts(posts);

    result.data = data;
  }
  else {
    result.error = error;
  }

  return result;
}

function remove(id) {
  const result = {};
  const error = [];

  const posts = readPosts();
  const index = posts.findIndex(entry => entry.id === id);

  let data;

  if (index < 0) {
    error.push(`The entry you are trying to remove, ${id}, could not be found`);
  }
  else if (error.length < 1) {
    data = posts.splice(index, 1)[0];
    writePosts(posts);

    result.data = data;
  }
  else {
    result.error = error;
  }

  return result;
}

module.exports = { getAll, getOne, create, update, remove };
