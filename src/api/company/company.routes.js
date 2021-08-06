const express = require('express');
const { createSchema, updateSchema } = require('./company.validators');
const companyService = require('./company.service');
const { auth: Auth } = require('../../_middlewares/auth');
const Role = require('../../utils/role');
const { scopedItems } = require('../../utils/permissions');

const Account = require('./accounts/accounts.routes');
const Menu = require('./menu/menu.routes');
const Order = require('./order/order.routes');

const router = express.Router({
  mergeParams: true,
});

// api/v1/company/1/accounts
router.use('/:company_id/accounts', Account);
router.use('/:company_id/menu', Menu);
router.use('/:company_id/order', Order);

router.post('/', Auth([Role.owner]), createSchema, create);
router.patch('/:id', Auth([Role.owner]), updateSchema, update);
router.get('/', Auth([Role.admin]), getAllCompanies);
router.get('/mine', Auth([Role.owner]), getMyCompanies);
router.get('/:id', Auth([Role.admin, Role.owner]), getCompanyById);
router.delete('/:id', Auth([Role.admin, Role.owner]), _deleteCompany);

module.exports = router;

function create(req, res, next) {
  req.body.owner_id = req.user.id;
  companyService
    .create(req.body)
    .then(company => res.json(company))
    .catch(next);
}

function getAllCompanies(req, res, next) {
  companyService
    .getAllCompanies()
    .then(companies => {
      res.json(scopedItems(req.user, companies));
    })
    .catch(next);
}
function getMyCompanies(req, res, next) {
  companyService
    .getMyCompanies(req.user.id)
    .then(companies => (companies ? res.json(companies) : res.sendStatus(404)))
    .catch(next);
}
function getCompanyById(req, res, next) {
  // owner can get his company and the admin can get any company
  companyService
    .getCompanyById(req.params.id)
    .then(company => {
      if (company.owner_id !== req.user.id && req.user.role !== Role.admin) {
        return res.status(401).json({ message: 'Unauthorized' });
      }

      res.json(company);
    })
    .catch(next);
}

function update(req, res, next) {
  // only owner can update their company
  companyService
    .updateCompany({ id: req.params.id, owner_id: req.user.id }, req.body)
    .then(company => res.json(company))
    .catch(next);
}

function _deleteCompany(req, res, next) {
  // only owner delete can delete their company
  companyService
    ._delete({ id: parseInt(req.params.id), owner_id: req.user.id })
    .then(() => {
      res.json({ id: parseInt(req.params.id) });
    })
    .catch(next);
}
