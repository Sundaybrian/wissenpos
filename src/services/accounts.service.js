const authService = require('./auth.service');
const Account = require('../api/company/accounts/accounts.model');

class AccountService {
  constructor() {}

  // add staff to company
  static async addToCompany(params) {
    try {
      const account = await Account.query().insert(params);
      return account;
    } catch (error) {
      throw error;
    }
  }

  // create staff
  static async createStaff({ user, company_id }) {
    try {
      const staff = await authService.createStaff(user, company_id);
      return staff;
    } catch (error) {
      throw error;
    }
  }

  //get staff accounts
  static async companyAccounts(company_id) {
    try {
      const companyAccounts = await Account.query()
        .alias('c')
        .where('c.company_id', company_id)
        .withGraphFetched('user(defaultSelectsWithoutPass)');

      return companyAccounts;
    } catch (error) {
      throw error;
    }
  }

  // update staff
  static async updateStaff(params) {}
  // delete staff
  //
}

module.exports = AccountService;
