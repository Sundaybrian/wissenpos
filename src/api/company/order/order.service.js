const Order = require("./order.model");

module.exports = {
    createOrder,
    updateOrderItem,
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

async function updateOrderItem(id, params) {
    const order = await getOrder(id);

    // check item quantity
    if (params.item.quantity <= 0) {
        // remove from cart
        await order
            .$relatedQuery("items")
            .delete()
            .where({ item: params.item.id });

        return;
    }

    const orderItem = await order
        .$relatedQuery("items")
        .patch({
            quantity: params.item.quantity,
        })
        .where({
            item: params.item.id,
        })
        .returning("*");

    return orderItem;
}

async function updateOrder(id, user, params) {
    let order = await getOrder(id).withGraphFetched("company");

    if (order.company.id !== user.company.id) {
        const error = new Error("Unathorized");
        throw error;
    }
    // aka update order table
    order = await Order.query().patchAndFetchById(id, params);

    return order;
}

async function getOrderById(id) {
    const order = await getOrder(id).withGraphFetched("items");
    return order;
}

async function getOwnOrders(id) {
    const orders = await Order.query()
        .where({ customer_id: id })
        .orderBy("created_at");
    return orders;
}

async function getCompanyOrders(params) {
    const orders = await Order.query().where(params).orderBy("created_at");
    return orders;
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

async function getOrder(id) {
    const order = await Order.query().findById(id);
    return order;
}
