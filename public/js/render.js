const axios = require("axios");
const blogContent = document.getElementById("blog-content");
const server = "https://polar-inlet-56421.herokuapp.com";


// Drops in each blog post
function fillBlogContent(data) {
  data.reverse().forEach(post => {
    blogContent.appendChild(buildPost(post));
  });
}

function buildPost(post) {
  // Generate the elements for displaying each post
  const postElement = document.createElement("div");
  const titleElement = document.createElement("h2");
  const contentElement = document.createElement("p");
  const hrElement = document.createElement("hr");
  const editElement = document.createElement("a");
  const deleteElement = document.createElement("a");

  // Configure the post element
  postElement.classList.add("element-post");

  // Configure the title element
  titleElement.innerText = post.title;
  titleElement.classList.add("title");

  // Configure the content element
  contentElement.innerText = post.content;
  contentElement.classList.add("content");

  // Configure the edit button
  editElement.innerText = "edit";
  editElement.id = "edit";
  editElement.classList.add("element-button");
  editElement.setAttribute("data-id", post.id);
  editElement.addEventListener("click", editHandler);

  // Configure the delete button
  deleteElement.innerText = "delete";
  deleteElement.id = "delete";
  deleteElement.classList.add("element-button");
  deleteElement.setAttribute("data-id", post.id);
  deleteElement.addEventListener("click", deleteHandler);

  // Attach the elements to the post element
  postElement.appendChild(titleElement);
  postElement.appendChild(contentElement);
  postElement.appendChild(editElement);
  postElement.appendChild(deleteElement);
  postElement.appendChild(hrElement);

  // Attach post element to the DOM

  return postElement;
}

// Add labels to an array of unlabelled input elements
function addLabels(elements) {
  return elements.map(el => {
    const label = document.createElement("label");
    let labelText = el.getAttribute("name");

    labelText = labelText.charAt(0).toUpperCase() + labelText.slice(1);
    label.innerText = labelText;
    label.appendChild(el);

    return label;
  });
}

// Append an array of children to a parent
function appendChildren(parent, children) {
  children.forEach(el => parent.appendChild(el));
}

// Renders the add/edit post forms
function renderForm (method, action, id, post) {
  const formArea = document.getElementById("form-area");
  const newPost = document.getElementById("new-post");

  // Create the form element
  const form = document.createElement("form");

  // Create the form components
  const idInput = document.createElement("input");
  const titleInput = document.createElement("input");
  const contentInput = document.createElement("textarea");
  const closeButton = document.createElement("button");
  const submitButton = document.createElement("button");

  // Configure the form
  // form.classList.add("folding-form");
  form.setAttribute("action", action);
  form.setAttribute("method", method);

  // Configure title input
  titleInput.setAttribute("name", "title");
  titleInput.setAttribute("type", "text");
  titleInput.id = "titleHTML";
  if (post) {
    titleInput.innerText = post.title;
  }

  // Configure content input
  contentInput.setAttribute("name", "content");
  contentInput.setAttribute("rows", "8");
  contentInput.setAttribute("cols", "80");
  if (post) {
    contentInput.innerText = post.content;
  }

  // Configure close button
  closeButton.setAttribute("type", "button");
  closeButton.setAttribute("name", "close");
  closeButton.innerText = "X Close";
  closeButton.addEventListener("click", closeHandler);

  // Configure submit button
  submitButton.setAttribute("type", "submit");
  submitButton.setAttribute("name", "submit");
  submitButton.classList.add("float-right");
  submitButton.innerText = "✓ Submit";
  submitButton.addEventListener("click", postHandler);

  // Add labels to inputs
  const labeledEls = addLabels([titleInput, contentInput]);

  // Add labeled inputs to the form
  appendChildren(form, labeledEls);

  // Add button to the form
  form.appendChild(closeButton);
  form.appendChild(submitButton);

  // Remove New Post button
  newPost.style.display = "none";

  // Add to the DOM
  formArea.appendChild(form);
}

function makeEditable(element) {
  const title = element.querySelector(".title");
  const content = element.querySelector(".content");
  const editButton = element.querySelector("#edit");
  const deleteButton = element.querySelector("#delete");

  const titleInput = document.createElement("input");
  const contentInput = document.createElement("textarea");
  const cancelButton = document.createElement("a");
  const submitButton = document.createElement("a");

  const titleValue = title.innerText;
  const contentValue = content.innerText;
  const postId = editButton.getAttribute("data-id");

  cancelButton.innerText = "cancel";
  cancelButton.id = "cancel";
  cancelButton.classList.add("element-button");
  cancelButton.setAttribute("data-id", postId);
  cancelButton.addEventListener("click", (e) => {
    makeNotEditable(e.target);
  });

  submitButton.innerText = "submit";
  submitButton.id = "submit";
  submitButton.classList.add("element-button");
  submitButton.setAttribute("data-id", postId);
  submitButton.addEventListener("click", submitEditHandler);

  // console.log(titleValue, contentValue);

  titleInput.setAttribute("name", "title");
  titleInput.setAttribute("type", "text");
  // titleInput.id = "titleHTML";

  contentInput.setAttribute("name", "content");
  contentInput.setAttribute("rows", "8");
  contentInput.setAttribute("cols", "80");

  titleInput.value = titleValue;
  contentInput.value = contentValue;

  element.insertBefore(titleInput, title);
  title.remove();

  element.insertBefore(contentInput, content);
  content.remove();

  element.insertBefore(cancelButton, editButton);
  editButton.remove();

  element.insertBefore(submitButton, deleteButton);
  deleteButton.remove();
}

function makeNotEditable(element) {
  console.log(element);
  const postId = element.getAttribute("data-id");
  axios.get(server + "/posts/" + postId)
  .then(res => {
    const newElement = buildPost(res.data.data);
    const post = element.parentElement;

    blogContent.insertBefore(newElement, post);
    post.remove();
  })
  .catch(err => {
    console.log(err);
  })
}


// Render the success callout
function successMessage(response) {
  const messageArea = document.getElementById("message-area");
  const successCallout = document.createElement("div");

  blogContent.insertBefore(buildPost(response.data.data), blogContent.children[0]);

  successCallout.classList.add("callout");
  successCallout.classList.add("success");

  successCallout.innerHTML = "<p>You did it! I was worried for a moment...</p>";

  messageArea.appendChild(successCallout);

  setTimeout(() => successCallout.remove(), 3000);
}

function errorMessage(error) {
  const messageArea = document.getElementById("message-area");
  const alertCallout = document.createElement("div");

  alertCallout.classList.add("callout");
  alertCallout.classList.add("alert");

  alertCallout.innerHTML = "<p>You done goofed.</p>";

  console.log(error);

  messageArea.appendChild(alertCallout);
}

// Fires when the "New Post" button is clicked
function newPostHandler(e) {
  const action = server + "/posts";

  renderForm("post", action);
}

function postHandler(e) {
  e.preventDefault();

  const formArea = document.getElementById("form-area");
  const newPost = document.getElementById("new-post");


  title =   e.target
             .parentElement
             .querySelector("input[name=\'title\']")
             .value;

  content = e.target
             .parentElement
             .querySelector("textarea[name=\'content\']")
             .value;

  formArea.innerHTML = "";
  newPost.style.display = "flex";

  axios.post(server + "/posts", { title, content })
  .then(res => successMessage(res))
  .catch(err => errorMessage(err));
}

function editHandler(e) {
  const id = e.target.getAttribute("data-id");

  makeEditable(e.target.parentElement);
}

function submitEditHandler(e) {
  const id = e.target.getAttribute("data-id");
  console.log(e.target.parentElement.querySelector("input[name=\'title\']"))
  const title = e.target.parentElement.querySelector("input[name=\'title\']").value;
  const content = e.target.parentElement.querySelector("textarea[name=\'content\']").value;

  axios.put(server + "/posts/" + id, { title, content })
  .then(res => {
    const newElement = buildPost(res.data.data);
    const post = e.target.parentElement;

    blogContent.insertBefore(newElement, post);
    post.remove();
  })
}

function deleteHandler(e) {
  axios.delete(server + "/posts/" + e.target.getAttribute("data-id"))
    .then(res => {
      e.target.parentElement.remove();
    })
    .catch(err => errorMessage(err));
}

function cancelEditHandler(e) {

  makeNotEditable(e.target.parentElement);
}

function closeHandler(e) {
  const newPost = document.getElementById("new-post");
  const formArea = document.getElementById("form-area");

  formArea.innerHTML = "";
  newPost.style.display = "flex";
}

module.exports = { fillBlogContent, newPostHandler };
