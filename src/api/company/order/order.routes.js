const express = require("express");
const {
    createOrder,
    updateOrderSchema,
    companyOrdersSchema,
} = require("./order.validators");
const { auth: Auth } = require("../../../_middlewares/auth");
const Role = require("../../../utils/role");
const orderService = require("./order.service");

const OrderItem = require("./orderItem/orderItem.routes");

router.use("/:order_id/orderItem", OrderItem);
const router = express.Router({
    mergeParams: true,
});

// update an order item customer aka update cart item
router.post("/", createOrderSchema, Auth(Role.customer), createOrder);
router.put(
    "/:id",
    updateOrderSchema,
    Auth([Role.staff, Role.owner]),
    updateOrder
);
router.get("/:id", Auth(), getOrderById);
router.get("/:id/my-orders", Auth(Role.customer), getOwnOrders);
router.get(
    "/company-orders",
    companyOrderSchema,
    Auth([Role.owner, Role.staff]),
    getCompanyOrders
);

function createOrder(req, res, next) {
    const payload = {
        customer_id: req.user.id,
        company_id: req.params.company_id,
        item: req.body,
    };
    orderService
        .createOrder(payload)
        .then((orderItem) =>
            res.json({
                message: `${orderItem.item} has been added to the cart`,
            })
        )
        .catch(next);
}

function updateOrder(req, res, next) {
    orderService
        .updateOrder(req.params.id, req.user, req.body)
        .then((order) => res.json(order))
        .catch(next);
}

function getOrderById(req, res, next) {
    orderService
        .getOrderById(id)
        .then((order) => (order ? res.json(order) : res.sendStatus(404)))
        .catch(next);
}

function getOwnOrders(req, res, next) {
    orderService
        .getOwnOrders(req.user.id)
        .then((orders) => (orders.length > 0 ? orders : res.sendStatus(404)))
        .catch(next);
}

function getCompanyOrders(req, res, next) {
    // TODO to use query params

    params.company_id = req.params.company_id;
    orderService
        .getCompanyOrders(params)
        .then((orders) => (orders.length > 0 ? orders : res.sendStatus(404)))
        .catch(next);
}
module.exports = router;
