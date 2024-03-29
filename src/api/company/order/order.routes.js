const express = require("express");
const {
    createOrderSchema,
    updateOrderSchema,
    companyOrderSchema,
    getOrderSchema,
} = require("./order.validators");

const { auth: Auth, isOwner } = require("../../../_middlewares/auth");
const Role = require("../../../utils/role");
const orderService = require("./order.service");

const OrderItem = require("./orderItem/orderItem.routes");

const router = express.Router({
    mergeParams: true,
});

router.use("/:order_id/orderItem", OrderItem);

// update an order item customer aka update cart item
router.post("/", createOrderSchema, addToCart);
router.get(
    "/company-orders",
    companyOrderSchema,
    Auth(),
    // Auth([Role.owner, Role.staff]),
    // isOwner(),
    getCompanyOrders
);
router.get("/orderStats", Auth(), orderStats);
router.get("/my-orders", getOrderSchema, fetchMyOrders);
router.get("/:id", getCartById);
router.patch(
    "/:id",
    updateOrderSchema,
    Auth([Role.staff, Role.owner]),
    updateOrder
);

function addToCart(req, res, next) {
    // TODO figure out how to inject customer id
    const payload = {
        cart_id: req.body.cart_id,
        company_id: parseInt(req.params.company_id),
        item_id: parseInt(req.body.product_id),
        quantity: parseInt(req.body.quantity),
    };

    // TODO document
    orderService
        .addToCart(payload)
        .then((orderItem) =>
            res.json({
                message: `${orderItem.item_id} has been added to the cart`,
                item: orderItem,
            })
        )
        .catch(next);
}

function getCartById(req, res, next) {
    const cart_id = req.params.id;
    orderService
        .getCartById(cart_id)
        .then((order) => (order ? res.json(order) : res.sendStatus(404)))
        .catch(next);
}

function fetchMyOrders(req, res, next) {
    const { cart_id } = req.body;
    let nextPage = null;
    const limit = parseInt(req.query.limit) || 30;
    const match = {
        cart_id: parseInt(cart_id),
    };

    if (req.query.nextPage) {
        nextPage = req.query.nextPage;
    }

    orderService
        .fetchMyOrders({ nextPage, match, limit })
        .then((orders) => (orders ? res.json(orders) : res.sendStatus(404)))
        .catch(next);
}

function updateOrder(req, res, next) {
    orderService
        .updateOrder(req.params.id, req.user, req.body)
        .then((order) => res.json(order))
        .catch(next);
}

function getCompanyOrders(req, res, next) {
    const { company_id } = req.params;
    let nextPage = null;
    let limit = null;
    const match = {
        company_id: parseInt(company_id),
    };

    if (req.query.order_status) {
        match.order_status = req.query.order_status;
    }
    if (req.query.purchase_status) {
        match.purchase_status = req.query.purchase_status;
    }

    if (req.query.nextPage) {
        nextPage = req.query.nextPage;
    }

    if (req.query.limit) {
        limit = parseInt(req.query.limit) || 50;
    }

    orderService
        .getCompanyOrders({ nextPage, match, limit })
        .then((orders) => {
            return orders ? res.json(orders) : res.json(orders);
        })
        .catch(next);
}

function orderStats(req, res, next) {
    const { company_id } = req.params;

    orderService
        .orderStats({ company_id })
        .then((stats) => (stats ? res.json(stats) : res.sendStatus(404)))
        .catch(next);
}

module.exports = router;
