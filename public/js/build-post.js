const axios = require("axios");

const server = "https://polar-inlet-56421.herokuapp.com";

const blogContent = document.getElementById("blog-content");

const {
  createButtons,
  addLabels,
  appendChildren,
  clearChildren,
  setAttributes
} = require("./utils");

function buildPost(post) {
  // Generate the elements for displaying each post
  const postElement = document.createElement("div");
  const titleElement = document.createElement("h2");
  const contentElement = document.createElement("p");
  const hrElement = document.createElement("hr");

  const [ editElement, deleteElement ] = createButtons({
    name: "edit",
    id: post.id,
    eventHandler: editHandler,
    extraClass: "element-button"
  },
  {
    name: "delete",
    id: post.id,
    eventHandler: deleteHandler,
    extraClass: "element-button"
  })

  // Configure the post element
  postElement.classList.add("element-post");

  // Configure the title element
  titleElement.innerText = post.title;
  titleElement.classList.add("title");

  // Configure the content element
  contentElement.innerText = post.content;
  contentElement.classList.add("content");

  // Attach the elements to the post element
  appendChildren(postElement,
    [ hrElement, titleElement, contentElement, editElement, deleteElement ]);

  // Attach post element to the DOM

  return postElement;
}


// Renders the add/edit post forms
function renderForm(method, action, id, post) {
  const formArea = document.getElementById("form-area");
  const newPost = document.getElementById("new-post");

  // Create the form element
  const form = document.createElement("form");

  // Create the form components
  const idInput = document.createElement("input");
  const titleInput = document.createElement("input");
  const contentInput = document.createElement("textarea");

  const [ closeButton, submitButton ] = createButtons({
    name: "close",
    id: id,
    eventHandler: closeHandler
  },
  {
    name: "submit",
    id: id,
    eventHandler: postHandler
  })

  // Configure the form
  setAttributes({ action: action, method: method });

  // Configure title input
  setAttributes(titleInput, { name: "title", type: "text" });

  titleInput.id = "titleHTML";
  if (post) {
    titleInput.innerText = post.title;
  }

  // Configure content input
  setAttributes(contentInput, {name: "content", rows: "8", cols: "80"});

  if (post) {
    contentInput.innerText = post.content;
  }

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

  const titleValue = title.innerText;
  const contentValue = content.innerText;
  const postId = editButton.getAttribute("data-id");

  const [ cancelButton, submitButton ] = createButtons({
    name: "cancel",
    id: postId,
    eventHandler: (e) => makeNotEditable(e.target)
  },
  {
    name: "submit",
    id: postId,
    eventHandler: submitEditHandler
  });

  console.log(buildPost)

  setAttributes(titleInput, { name: "title", type: "text" });
  setAttributes(contentInput, { name: "content", rows: "8", cols: "80" });

  titleInput.value = titleValue;
  contentInput.value = contentValue;

  clearChildren(element);
  appendChildren(element,
    [ titleInput, contentInput, cancelButton, submitButton ]);
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
  const blogContent = document.getElementById("blog-content");

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
  const blogContent = document.getElementById("blog-content");

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

module.exports = {
  closeHandler,
  cancelEditHandler,
  deleteHandler,
  submitEditHandler,
  editHandler,
  postHandler,
  newPostHandler,
  buildPost
}
