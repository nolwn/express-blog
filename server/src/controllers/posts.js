// My files
const model = require("../models/posts");

function getAll(req, res, next) {
  const from = req.params.size;
  const to = req.params.start;
  const data = model.getAll(size, start);

  res.status(200).send(data);
}

function getOne(req, res, next) {
  const id = req.params.id;
  const data = model.getOne(id);

  if (data.error) {
    next({ status : 404, error : data.error });
  } else {
    res.status(200).send(data);
  }
}

function create(req, res, next) {
  const body = req.body;
  const data = model.create(body);

  if (data.error) {
    next({ status : 400, error : data.error });
  } else {
    res.status(201).send(data);
  }
}

function update(req, res, next) {
  const id = req.params.id;
  const body = req.body;
  const data = model.update(id, body);

  if (data.error) {
    next({ status : 400, error : data.error });
  } else {
    res.status(200).send(data);
  }
}

function remove(req, res, next) {
  const id = req.params.id;
  const data = model.remove(id);

  if (data.error) {
    next({ status : 404, error : data.error });
  } else {
    res.status(200).send(data);
  }
}

module.exports = { getAll, getOne, create, update, remove };
