const Item = require('./item.model');
const error = require('../../../../../utils/error');

module.exports = {
  createItem,
  getItemById,
  updateItem,
  deleteItem,
};

async function createItem(params) {
  const item = await Item.query().insert(params);
  return item;
}

async function getItemById(id) {
  const item = await getItem({ id });
  if (!item) {
    return null;
  }
  return item;
}

async function updateItem(id, params) {
  const updateItem = await Item.query().patchAndFetchById(id, params);

  return updateItem;
}

async function deleteItem(queryParams) {
  await Item.query()
    .delete()
    .where({ ...queryParams });
}

// =================== helpers ============================
async function getItem(params) {
  const item = await Item.query()
    .where({ ...params })
    .first();
  return item;
}

function basicDetails(item) {
  const { id, name, description } = item;
  return { id, name, description };
}
