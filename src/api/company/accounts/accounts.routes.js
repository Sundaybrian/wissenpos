const Account = require('./accounts.model');
const Company = require('../company.model');
const Role = require('../../../utils/role');
const { createSchema } = require('./accounts.validators');
const { auth: Auth, isOwner } = require('../../../_middlewares/auth');
const AccountService = require('./accounts.service');

const router = require('express').Router({
  mergeParams: true,
});

router.post('/', Auth([Role.admin, Role.owner]), isOwner(), createSchema, createStaffAccount);
router.get('/', Auth([Role.admin, Role.owner]), isOwner(), getAccounts);

module.exports = router;

// add staff to company account
function createStaffAccount(req, res, next) {
  const payload = {
    ...req.body,
  };
}
// get staff from company account

// get company accounts
// TODO add permissions
function getAccounts(req, res, next) {
  return AccountService.companyAccounts(req.params.company_id)
    .then(accounts => {
      return accounts ? res.json(accounts) : res.status(404);
    })
    .catch(next);
}
//update staff account
// delete staff account
