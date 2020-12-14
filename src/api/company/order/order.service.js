const Order = require("./order.model");

module.exports = {
    createOrder,
    updateOrder,
    getOrderById,
    getOwnOrders,
    getCompanyOrders,
};

async function createOrder(params) {
    const order = await get_or_create(params.customer_id, params.company_id);

    // insert the item to the order item table

    const orderItem = order
        .$relatedQuery("items")
        .insert({ item: params.item.id, order: order.id });

    return orderItem;
}

// =======================helpers==========================
async function get_or_create(id, company_id) {
    // checks for the existence of a customer order
    // if it exists add the new items on it
    // if it does not exist it creates one

    let order = await Order.query()
        .where({
            customer_id: id,
            order_status: "New",
        })
        .first();

    if (!order) {
        // create one
        order = await Order.query().insert({
            customer_id: id,
            company_id,
            order_status: "New",
            purchase_status: "unpaid",
        });
    }

    return order;
}
