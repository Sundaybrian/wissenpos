const Role = require('../../constants/role');
const CompanyService = require('../../api/company/company.service');

// permissions
function canDeleteCompany(user, company) {
  return user.role == Role.admin || user.id == company.owner_id;
}
function canUpdateCompany(user, company) {
  return user.role == Role.admin || user.id == company.owner_id;
}

// permissions middlewares
function setCompanyOwner(req, res, next) {
  const id = parseInt(req.params.id);
  CompanyService.getCompanyById(id)
    .then(c => {
      if (!c) return res.sendStatus(404);
      req.company = company;
      next();
    })
    .catch(next);
}

function authUpdateCompany(req, res, next) {
  if (!canUpdateCompany(req.user, req.company)) {
    res.status(401);
    return res.send('Action is Not Allowed');
  }

  next();
}

function authDeleteCompany(req, res, next) {
  if (!canDeleteCompany(req.user, req.company)) {
    res.status(401);
    return res.send('Action is Not Allowed');
  }

  next();
}

module.exports = {
  setCompanyOwner,
  authUpdateCompany,
  authDeleteCompany,
};
