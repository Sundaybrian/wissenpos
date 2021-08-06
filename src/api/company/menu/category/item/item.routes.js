const express = require('express');
const { createSchema, updateSchema } = require('./item.validators');
const { auth: Auth, isOwner } = require('../../../../../_middlewares/auth');
const Role = require('../../../../../utils/role');
const itemService = require('./item.service');

const router = express.Router({
  mergeParams: true,
});

router.post('/', Auth([Role.owner]), isOwner(), createSchema, create);
router.get('/:id', getById);
router.patch('/:id', Auth([Role.owner]), isOwner(), updateSchema, updateItem);
router.delete('/:id', Auth([Role.owner]), isOwner(), deleteItem);

module.exports = router;

function create(req, res, next) {
  req.body.category_id = parseInt(req.params.category_id);
  itemService
    .createItem(req.body)
    .then(item => res.status(201).json(item))
    .catch(next);
}

function getById(req, res, next) {
  const id = parseInt(req.params.id);
  itemService
    .getItemById(id)
    .then(item => (item ? res.json(item) : res.sendStatus(404)))
    .catch(next);
}

function updateItem(req, res, next) {
  const id = parseInt(req.params.id);
  itemService
    .updateItem(id, req.body)
    .then(item => (item ? res.json(item) : res.sendStatus(404)))
    .catch(next);
}

function deleteItem(req, res, next) {
  const id = parseInt(req.params.id);
  itemService
    .deleteItem({ id })
    .then(() =>
      res.json({
        message: 'Item deleted successfully',
        id,
      }),
    )
    .catch(next);
}
