const Order = require("./order.model");

module.exports = {
    addToCart,
    updateCartItem,
    updateOrder,
    getCartById,
    fetchMyOrders,
    getCompanyOrders,
};

async function addToCart(params) {
    const order = await get_or_create(params.cart_id, params.company_id);

    // insert the item to the order item table
    const orderItem = order.$relatedQuery("items").insert({
        item_id: params.product_id,
        order: order.id,
        quantity: params.quantity,
    });

    return orderItem;
}

async function updateCartItem(id, params) {
    const order = await getOrder(id);

    let orderItem;
    // check item quantity
    if (params.item.quantity <= 0) {
        // remove from cart
        orderItem = await order
            .$relatedQuery("items")
            .delete()
            .where({ item_id: params.product_id });

        return orderItem;
    }

    orderItem = await order
        .$relatedQuery("items")
        .patch({
            quantity: params.item.quantity,
        })
        .where({
            item_id: params.item.product_id,
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

async function getCartById(id) {
    const order = await getOrder(id);
    if (!order) return null;
    return basicDetails(order);
}

async function fetchMyOrders(id) {
    const orders = await Order.query()
        .where({ cart_id: id })
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

    let order = await getOrder(id);

    if (!order) {
        // create one
        order = await Order.query().insert({
            cart_id: id,
            company_id,
            order_status: "New",
            purchase_status: "unpaid",
        });
    }

    return order;
}

// =========== helpers===========

async function getOrder(id) {
    const order = await Order.query()
        .where({
            cart_id: id,
            order_status: "New",
        })
        .withGraphFetched("items")
        .first();

    return order;
}

async function basicDetails(order) {
    const {
        cart_id,
        order_status,
        purchase_status,
        subtotal,
        company_id,
        items,
    } = order;

    return {
        cart_id,
        order_status,
        purchase_status,
        subtotal,
        company_id,
        items,
    };
}
