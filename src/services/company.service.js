const Company = require('../api/company/company.model');
const error = require('../utils/error');
const createError = require('http-errors');

module.exports = {
  create,
  updateCompany,
  getAllCompanies,
  getMyCompanies,
  getCompanyById,
  _delete,
};

async function create(params) {
  // validate if company name exists
  if (await getCompany({ name: params.name })) {
    error('Name "' + params.name + '" is already registered');
  }

  const company = await Company.query().insert(params);
  return company;
}

async function updateCompany(queryParams, params) {
  const company = await getCompany({ ...queryParams });

  if (!company) {
    error('Unauthorized');
  }

  // validate if name was changed
  if (params.name && company.name !== params.name && (await getCompany({ name: params.name }))) {
    error(`Name ${params.name} is already taken`);
  }

  const updatedCompany = await Company.query().patchAndFetchById(queryParams.id, {
    ...params,
  });

  return updatedCompany;
}

async function getAllCompanies() {
  const companies = await Company.query();
  return companies;
}

async function getMyCompanies(ownerId) {
  const companies = await Company.query().where({
    owner_id: ownerId,
  });
  return companies;
}

async function getCompanyById(id) {
  const company = await getCompany({ id });
  return company;
}

async function _delete(queryParams) {
  const tobeDeleted = await getCompany(queryParams);

  if (tobeDeleted) {
    return await Company.query()
      .delete()
      .where({ ...queryParams });
  }

  return error('Forbidden');
}

// async function _softDelete(id) {
//mark as inactive
//  await Company.query().deleteById(id);

// }

// =========== helpers===========

async function getCompany(param) {
  const company = await Company.query()
    .where({ ...param })
    .first();
  return company;
}
