const axios = require("axios");
const blogContent = document.getElementById("blog-content");
const server = "https://polar-inlet-56421.herokuapp.com";


// Drops in each blog post
function fillBlogContent(data) {
  data.reverse().forEach(post => {
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

    // Configure the content element
    contentElement.innerText = post.content;

    // Configure the edit button
    editElement.innerText = "edit";
    editElement.id = "edit";
    editElement.classList.add("element-button");
    editElement.setAttribute("data_id", post.id);

    // Configure the delete button
    deleteElement.innerText = "delete";
    deleteElement.id = "delete";
    deleteElement.classList.add("element-button");
    deleteElement.setAttribute("data_id", post.id);

    // Attach the elements to the post element
    postElement.appendChild(titleElement);
    postElement.appendChild(contentElement);
    postElement.appendChild(editElement);
    postElement.appendChild(deleteElement);
    postElement.appendChild(hrElement);

    // Attach post element to the DOM
    blogContent.appendChild(postElement);
  });
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

  console.log(form);

  // Add to the DOM
  formArea.appendChild(form);
}

// Render the success callout
function successMessage() {
  const messageArea = document.getElementById("message-area");
  const successCallout = document.createElement("div");

  successCallout.classList.add("callout");
  successCallout.classList.add("success");

  successCallout.innerHTML = "<p>You did it! I was worried for a moment...</p>";

  messageArea.appendChild(successCallout);
}

function errorMessage() {
  const messageArea = document.getElementById("message-area");
  const alertCallout = document.createElement("div");

  alertCallout.classList.add("callout");
  alertCallout.classList.add("alert");

  alertCallout.innerHTML = "<p>You done goofed.</p>";

  messageArea.appendChild(alertCallout);
}

// Fires when the "New Post" button is clicked
function newPostHandler(e) {
  const action = server + "/posts";

  renderForm("post", action);
}

function postHandler(e) {
  const formArea = document.getElementById("form-area");
  const newPost = document.getElementById("new-post");

  e.preventDefault();

  formArea.innerHTML = "";
  newPost.style.display = "flex";

  axios.post(server + "/posts")
  .then(res => successMessage())
  .catch(err => errorMessage());
}

function editHandler(e) {
  const id = e.target.getAttribute("data_id");

}

function deleteHandler(e) {

}

module.exports = { fillBlogContent, newPostHandler };
