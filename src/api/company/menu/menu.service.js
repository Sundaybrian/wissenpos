const Menu = require("../menu/menu.model");
const error = require("../../../utils/error");

module.exports = {
    createMenu,
    updatemenu,
    getAllMenu,
    getMenuById,
    _delete,
};

async function create(params) {
    const menu = await Menu.query().insert(params);
    return menu;
}

async function updatemenu(queryParams, params) {
    const menu = await getMenu({ ...queryParams });

    // since it will be role based and company tied authorization, sending back unathorized if a user tries to update another users menu
    if (!menu) {
        error("Unauthorized");
    }

    const updatedmenu = await Menu.query().patchAndFetchById(id, {
        ...params,
    });

    return updatedmenu;
}

async function getAllMenu() {
    const menus = await Menu.query();
    return menus;
}

async function getMenuById(id) {
    // TODO withGraphFetched('menu_categories')
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
        .first();
    return menu;
}
