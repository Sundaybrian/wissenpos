const authService = require('../../auth/auth.service');
const Account = require('../accounts/accounts.model');

class AccountService {
  constructor() {}

  static async addToCompany(params) {
    try {
      const account = await Account.query().insert(params);
      return account;
    } catch (error) {
      throw error;
    }
  }

  static async createStaff({ user, company_id }) {
    try {
      const staff = await authService.createStaff(user, company_id);
      return staff;
    } catch (error) {
      throw error;
    }
  }

  static async companyAccounts(company_id) {
    try {
      const companyAccounts = await Account.query()
        .alias('c')
        .where('c.id', company_id)
        .withGraphFetched('user(selectNameAndId)')
        .modifiers({
          selectNameAndId(builder) {
            builder
              .select(
                'company_id',
                'staff_id',
                'firstName',
                'lastName',
                'email',
                'phoneNumber',
                'role',
                'image_url',
                'active',
                'user.id as user_id',
              )
              .innerJoin('user', 'accounts.staff_id', 'user.id');
          },
        });

      return companyAccounts;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = AccountService;
