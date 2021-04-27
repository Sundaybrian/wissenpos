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
    const order = await getOrder(id, true);
    if (!order) return null;
    return basicDetails(order);
}

async function fetchMyOrders({ nextPage, match, limit }) {
    try {
        let orders = await Order.query()
            .alias("o")
            .where(match)
            // .modify("defaultSelects")
            .withGraphFetched(`[items(defaultSelects)]`)
            .orderBy("o.id")
            .limit(limit)
            .cursorPage();

        if (nextPage) {
            orders = await Order.query()
                .alias("o")
                .where(match)
                // .modify("defaultSelects")
                .withGraphFetched(`[items(defaultSelects)]`)
                .orderBy("o.id")
                .limit(limit)
                .cursorPage(nextPage);
        }

        return orders;
    } catch (error) {
        console.log(`[fetchMyOrders]`);
        throw error;
    }
}

async function getCompanyOrders({ nextPage, match, limit }) {
    try {
        let orders = await Order.query()
            .alias("o")
            .where(match)
            // .modify("defaultSelects")
            .withGraphFetched(
                `[customer(defaultSelects), items(defaultSelects)]`
            )
            .orderBy("o.id")
            .limit(limit)
            .cursorPage();

        if (nextPage) {
            orders = await Order.query()
                .alias("o")
                .where(match)
                // .modify("defaultSelects")
                .withGraphFetched(
                    `[customer(defaultSelects), items(defaultSelects)]`
                )
                .orderBy("o.id")
                .limit(limit)
                .cursorPage(nextPage);
        }

        return orders;
    } catch (error) {
        console.log(`[getCompanyOrders]`);
        throw error;
    }
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

async function getOrder(id, withItemData = false) {
    let order = await Order.query()
        .where({
            cart_id: id,
            order_status: "New",
        })
        .withGraphFetched("items")
        .first();

    if (withItemData) {
        order = await Order.query()
            .where({
                cart_id: id,
                order_status: "New",
            })
            .withGraphFetched("items(withItemData)")
            .modifiers({
                withItemData(builder) {
                    builder
                        .select(
                            "orderItem.*",
                            "item.name",
                            "item.image_url",
                            "item.price"
                        )
                        .innerJoin("item", "orderItem.item_id", "item.id");
                },
            })
            .first();
    }

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
