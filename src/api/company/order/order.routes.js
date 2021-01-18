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
router.get("/:id", getCartById);
router.get("/:id/my-orders", Auth(Role.customer), fetchMyOrders);
router.patch(
    "/:id",
    updateOrderSchema,
    Auth([Role.staff, Role.owner]),
    updateOrder
);
router.get(
    "/company-orders",
    companyOrderSchema,
    Auth([Role.owner, Role.staff]),
    isOwner(),
    getCompanyOrders
);

function addToCart(req, res, next) {
    const payload = {
        cart_id: req.body.cart_id,
        company_id: parseInt(req.params.company_id),
        product_id: parseInt(req.body.product_id),
        quantity: parseInt(req.body.quantity),
    };

    orderService
        .addToCart(payload)
        .then((orderItem) =>
            res.json({
                message: `${orderItem.item} has been added to the cart`,
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

function updateOrder(req, res, next) {
    orderService
        .updateOrder(req.params.id, req.user, req.body)
        .then((order) => res.json(order))
        .catch(next);
}

function fetchMyOrders(req, res, next) {
    orderService
        .fetchMyOrders(req.user.id)
        .then((orders) => (orders.length > 0 ? orders : res.sendStatus(404)))
        .catch(next);
}

function getCompanyOrders(req, res, next) {
    // TODO to use query params for rich data

    params.company_id = req.params.company_id;
    orderService
        .getCompanyOrders(params)
        .then((orders) => (orders.length > 0 ? orders : res.sendStatus(404)))
        .catch(next);
}
module.exports = router;
