const jwt = require('jsonwebtoken');
const User = require('../api/user/user.model');
const Company = require('../api/company/company.model');

module.exports = {
  auth,
  isOwner,
};

function auth(roles = []) {
  if (typeof roles === 'string') {
    roles = [roles];
  }

  return async (req, res, next) => {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
      token = req.headers.authorization.split('Bearer ')[1];
    } else {
      return res.status(403).json({
        message: 'Token not found, access denied',
      });
    }

    // verify token and account
    try {
      const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

      const user = await User.query().where({ id: decodedToken.id }).first();

      if (!user || (roles.length && !roles.includes(decodedToken.role))) {
        // account does not exist or role not authorized
        return res.status(401).json({ message: 'Unauthorized' });
      }

      // authentication and authorization successful
      req.user = decodedToken;
      next();
    } catch (error) {
      next(error);
    }
  };
}

function isOwner() {
  return async (req, res, next) => {
    try {
      const bool = await Company.query()
        .where({
          owner_id: req.user.id,
          id: req.params.company_id,
        })
        .first();

      if (!bool) {
        console.log(bool);
        return res.status(401).json({ message: 'Unauthorized' });
      }
      next();
    } catch (error) {
      next(error);
    }
  };
}
