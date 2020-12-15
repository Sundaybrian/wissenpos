const express = require("express");
const { auth: Auth } = require("../../../../_middlewares/auth");
const role = require("../../../../utils/role");
const orderService = require("../order.service");

const router = express.router({
    mergeParams: true,
});

router.put("/", Auth(role.customer), updateOrderItem);

function updateOrderItem(req, res, next) {
    orderService.updateOrderItem();
}

module.exports = router;
