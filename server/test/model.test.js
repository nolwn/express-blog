const chai = require("chai");
const models = require("../src/models/posts");
const fs = require("fs");
const assert = chai.assert;

const readPosts = () =>
  JSON.parse(fs.readFileSync("src/db/posts.json", "utf-8"));
const writePosts = (update) =>
  fs.writeFileSync("src/db/posts.json", JSON.stringify(update));

describe("Unit Testing: Models", function () {
  describe("getAll function", function () {
    it("Returns everything in the database", function () {
      const expectedPosts = readPosts();
      const posts = models.getAll();
      const expectedNPosts = expectedPosts.length;
      const nPosts = posts.data.length;

      assert.equal(nPosts, expectedNPosts);
      assert.deepEqual(posts.data, expectedPosts);
      assert.notExists(posts.error);
    });
  });

  describe("getOne function", function () {
    it("Returns an item with a given id", function () {
      const expectedId = readPosts()[0].id;
      const expectedPost = readPosts()[0];
      const post = models.getOne(expectedId);

      assert.equal(post.data.id, expectedId);
      assert.deepEqual(post.data, expectedPost);
      assert.notExists(post.error);
    });

    it("Throws an error when the id does not exists", function () {
      const falseId = "1234";
      const post = models.getOne(falseId);

      assert.exists(post.error);
    });
  });

  describe("create function", function () {
    after(function () {
      const finalPosts = readPosts();
      finalPosts.splice(finalPosts.length - 1, 1);
      writePosts(finalPosts);
    });

    it("Creates and returns a new post with a valid uuid", function () {
      const regExUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
      const returnedPost = models.create({
        title : "This is a test.",
        content : "This is a test."
      });
      const posts = readPosts();
      const post = posts[posts.length - 1];
      const isUuid = regExUUID.test(returnedPost.data.id);

      assert.deepEqual(post, returnedPost.data);
      assert.isTrue(isUuid);
      assert.containsAllKeys(returnedPost.data, ["title", "id", "content"]);
      assert.notExists(post.error);
    });

    it("Throws an error when the body does not contain a title and content",
    function () {
      const title = "Another test.";
      const returned = models.create ({ title : title });
      const posts = readPosts();
      const post = posts[posts.length - 1];

      assert.notEqual(post.title, );
      assert.exists(returned.error);
    });
  });

  describe("update function", function () {
    const id = "427cb688-e5dc-11e8-b68e-7200067293d0";
    const content = "This is test content.";

    before(function () {
      const firstTitle = "This is a test";
      const posts = readPosts();
      const testPost = { id : id, title : firstTitle, content : content };

      posts.push(testPost);

      writePosts(posts);
    });

    after(function () {
      const posts = readPosts();

      posts.pop();

      writePosts(posts);
    });

    it("Updates and returns a given post", function () {
      const secondTitle = "This is a test of update";
      const returnedPost = models.update(id, {
        title : secondTitle,
        content : content
      });
      const posts = readPosts();
      const updatedPost = posts[posts.length - 1];

      assert.deepEqual(returnedPost.data, updatedPost);
      assert.equal(updatedPost.id, id);
      assert.equal(updatedPost.title, secondTitle);
      assert.equal(updatedPost.content, content);
    });

    it("Returns an error if the id cannot be found", function () {
      const failingUpdate = "This should not be added!";
      const returnedPost = models.update("123", {
        title : failingUpdate,
        content : content
      });
      const posts = readPosts();
      const updatedPost = posts[posts.length - 1];

      assert.exists(returnedPost.error);
      assert.notEqual(updatedPost.title, failingUpdate);
    });

    it("Returns an error if it is missing a property", function () {
      const failingUpdate = "This should not be added!";
      const returnedPost = models.update(id, { title : failingUpdate });
      const posts = readPosts();
      const updatedPost = posts[posts.length - 1];

      assert.exists(returnedPost.error);
      assert.notEqual(updatedPost.title, failingUpdate);
    });
  });

  describe("remove function", function () {
    const id = "427cb688-e5dc-11e8-b68e-7200067293d0";
    const content = "This is test content.";
    const firstTitle = "This is a test";

    before(function () {
      const posts = readPosts();
      const testPost = { id : id, title : firstTitle, content : content };

      posts.push(testPost);

      writePosts(posts);
    });

    after(function () {
      const posts = readPosts();

      if (posts[posts.length - 1].id === id) {
        posts.pop();
        writePosts(posts);
      }
    });

    it("Removes a given element", function () {
      const returnedPost = models.remove(id);
      const posts = readPosts();
      const lastPost = posts[posts.length - 1];

      assert.deepEqual(returnedPost.data, { id : id, title : firstTitle, content : content });
      assert.notEqual(lastPost.id, id);
      assert.notExists(returnedPost.error);
    });
  });
});
