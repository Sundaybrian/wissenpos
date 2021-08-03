const Role = require('../../../utils/role');
const { createSchema } = require('./accounts.validators');
const { setCompanyOwner, authDeleteCompany, authUpdateCompany } = require('../../../utils/_permissions/company');
const { auth: Auth, isOwner } = require('../../../_middlewares/auth');
const AccountService = require('./accounts.service');
const AuthService = require('../../auth/auth.service');

const router = require('express').Router({
  mergeParams: true,
});

router.post('/', Auth([Role.owner]), createSchema, setCompanyOwner, authUpdateCompany, createStaffAccount);
router.get('/', Auth([Role.admin, Role.owner]), setCompanyOwner, authUpdateCompany, getAccounts);

module.exports = router;

// add staff to company account
function createStaffAccount(req, res, next) {
  const { company_id, user } = req.body;
  AuthService.createStaff(user, company_id)
    .then(staff => res.status(201).json(staff))
    .catch(next);
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
