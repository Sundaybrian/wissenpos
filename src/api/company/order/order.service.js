const Order = require("./order.model");

module.exports = {
    createOrder,
    updateOrder,
    getOrderById,
    getOwnOrders,
    getCompanyOrders,
};

async function createOrder(params) {
    const order = await Order.query().insert({});

    return order;
}

// =======================
async function get_or_create() {}
