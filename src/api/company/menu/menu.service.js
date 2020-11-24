const Menu = require("../menu/menu.model");
const error = require("../../../utils/error");

module.exports = {
    createMenu,
    updateMenu,
    getAllMenu,
    getAllCompanyMenus,
    getMenuById,
    _delete,
};

async function createMenu(params) {
    const menu = await Menu.query().insert(params);
    return menu;
}

async function updateMenu(queryParams, params) {
    const updatedmenu = await Menu.query().patchAndFetchById(id, {
        ...params,
    });

    return updatedmenu;
}

async function getAllMenu() {
    const menus = await Menu.query();
    return menus;
}

async function getAllCompanyMenus(params) {
    const menus = await Menu.query({ ...params });
    return menus;
}

async function getMenuById(id) {
    const menu = await getMenu({ id });
    return menu;
}

async function _delete(queryParams) {
    await Menu.query().delete({ ...queryParams });
}

// async function _softDelete(id) {
//mark as inactive
//  await menu.query().deleteById(id);

// }

// =========== helpers===========

async function getMenu(param) {
    const menu = await Menu.query()
        .where({ ...param })
        .withGraphFetched("categories")
        .first();
    return menu;
}
