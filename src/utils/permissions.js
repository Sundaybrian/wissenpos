const role = require("./role");

function scopedItems(user, items) {
    if (user.role == role.admin) return items;
    return items.filter((item) => item.owner_id == user.id);
}

module.exports = {
    scopedItems,
};
