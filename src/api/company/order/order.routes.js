const express = require("express");
const { createOrder } = require("./order.validators");
const { auth: Auth } = require("../../../_middlewares/auth");
const Role = require("../../../utils/role");

const OrderItem = require("./orderItem/orderItem.routes");
const router = express.Router({
    mergeParams: true,
});

// router.use("/:order_id/orderItem", OrderItem);

// get company orders
// get customer orders
// get orderby id customer with graphfetched orderitems
// get orderby id company with graphfetched orderitems
// create an order customer aka add to cart
// update an order customer aka update cart
//

router.get("/", getCompanyOrders);

function getCompanyOrders(req, res, next) {}

module.exports = router;
