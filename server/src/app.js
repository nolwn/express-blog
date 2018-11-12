// npm modules
const morgan = require("morgan");
const bodyParser = require("body-parser");
const express = require("express");
const cors = require("cors");
const app = express();
const port = process.env.PORT || 3000;

// My files
const routes = require("./routes/posts");

app.use(cors());
app.use(bodyParser.json());
app.use(morgan("dev"));

app.use("/posts", routes);

app.use((req, res, next) => {
  next({ error : "Path not found.", status : 404 });
});

app.use((err, req, res, next) => {
  const error = {};

  error.error = err.error || "Internal server error.";
  error.status = err.status || 404;
  error.stack = err.stack || undefined;

  res.status(error.status).send(error);
})

function listener() {
  console.log(`Listening on port ${port}`);
}

app.listen(port, listener);
