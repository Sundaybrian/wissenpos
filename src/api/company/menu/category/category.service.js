const Category = require("./category.model");
const error = require("../../../../utils/error");

module.exports = {
    createCategory,
    updateCategory,
    getAllCategory,
    getAllCompanyCategorys,
    getCategoryById,
    _delete,
};

async function createCategory(params) {
    const category = await Category.query().insert(params);
    return category;
}

async function updateCategory(id, params) {
    const category = await getCategory({ id });
    //check if category name is duplicated
    if (
        params.name &&
        category.name !== params.name &&
        (await getCategory({
            name: params.name,
            menu_id: params.menu_id,
        }))
    ) {
        error(`Category ${params.name} already exists`);
    }
    const updatedcategory = await Category.query().patchAndFetchById(id, {
        ...params,
    });

    return updatedcategory;
}

async function getAllCategory() {
    const categorys = await Category.query();
    return categorys;
}

async function getAllCompanyCategorys(params) {
    const categorys = await Category.query({ ...params });
    return categorys;
}

async function getCategoryById(id) {
    const category = await getCategory({ id });
    return category;
}

async function _delete(queryParams) {
    await Category.query().delete({ ...queryParams });
}

// async function _softDelete(id) {
//mark as inactive
//  await category.query().deleteById(id);

// }

// =========== helpers===========

async function getCategory(param) {
    const category = await Category.query()
        .where({ ...param })
        .withGraphFetched("items")
        .first();

    return category;
}
