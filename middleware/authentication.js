const { UnauthenticatedError, UnauthorizedError } = require("../errors");
const { isTokenValid } = require("../utils");

const authenticateUser = async (req, res, next) => {
  const token = req.signedCookies.token;
  if (!token) {
    throw new UnauthenticatedError("Authentication Invalid");
  }
  try {
    const { name, role, userId } = isTokenValid({ token });
    req.user = { name, role, userId };
    next();
  } catch (e) {
    throw new UnauthenticatedError("Authentication Invalid");
  }
};

const authorizePermissions = (req, res, next) => {
  if (req.user.role !== "admin") {
    throw new UnauthorizedError("Unauthorized to access this route!");
  }
  next();
};

module.exports = { authenticateUser, authorizePermissions };
