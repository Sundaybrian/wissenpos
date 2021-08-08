const Role = require('../../../utils/role');
const { createSchema, updateSchema } = require('./accounts.validators');
const { setCompanyOwner, authDeleteCompany, authUpdateCompany } = require('../../../utils/_permissions/company');
const { auth: Auth, isOwner } = require('../../../_middlewares/auth');
const AccountService = require('../../../services/accounts.service');
const AuthService = require('../../../services/auth.service');
const authService = require('../../../services/auth.service');

const router = require('express').Router({
  mergeParams: true,
});

router.post('/', Auth([Role.owner]), createSchema, setCompanyOwner, authUpdateCompany, createStaffAccount);
router.get('/', Auth([Role.admin, Role.owner]), setCompanyOwner, authUpdateCompany, getAccounts);
//todo: add permissions and lock to owner
router.put('/:id', Auth([Role.owner, Role.admin]), updateSchema, updateStaff);
router.delete('/:id', Auth([Role.owner, Role.admin]), deleteStaff);

module.exports = router;

// add staff to company account
function createStaffAccount(req, res, next) {
  const { company_id, user } = req.body;
  AuthService.createStaff(user, company_id)
    .then(staff => res.status(201).json(staff))
    .catch(next);
}

// get company accounts
function getAccounts(req, res, next) {
  return AccountService.companyAccounts(req.params.company_id)
    .then(accounts => {
      return accounts ? res.json(accounts) : res.status(404);
    })
    .catch(next);
}

//update staff account
function updateStaff(req, res, next) {
  authService
    .update(req.params.id, req.body)
    .then(account => res.json(account))
    .catch(next);
}

// delete staff account
function deleteStaff(req, res, next) {
  authService
    .delete(req.param.id)
    .then(() =>
      res.json({
        message: 'Account deleted successfully',
        id: req.params.id,
      }),
    )
    .catch(next);
}
