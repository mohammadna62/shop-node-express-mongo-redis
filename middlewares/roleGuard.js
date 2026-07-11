const { errorResponse } = require("../helpers/responses");

module.exports = (roles) => {
  return async (req, res, next) => {
    try {
      if (!req.user || !req.user.roles) {
        return errorResponse(
          res,
          401,
          "User not authenticated or roles missing",
        );
      }
      const hasAccessRole = roles.some((role) => {
        return req.user.roles.includes(role);
      });
      if (!hasAccessRole) {
        return errorResponse(
          res,
          403,
          "You do not have access to this route !!",
        );
      }

      next();
    } catch (err) {
      next(err);
    }
  };
};
