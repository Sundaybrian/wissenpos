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

async function updateMenu(id, params) {
    const menu = await getMenu({ id });
    //check if menu name is duplicated
    if (
        params.name &&
        menu.name !== params.name &&
        (await getMenu({
            name: params.name,
            company_id: params.company_id,
        }))
    ) {
        error(`Menu ${params.name} already exists`);
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

async function getAllCompanyMenus(params) {
    const menus = await Menu.query({ ...params });
    return menus;
}

async function getMenuById(id) {
    const menu = await getMenu({ id });
    return basicDetails(menu);
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

function basicDetails(menu) {
    const { id, name, company_id, categories } = menu;

    return { id, name, company_id, categories };
}
