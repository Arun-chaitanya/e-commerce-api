const login = async (req, res) => {
  return res.send("login");
};

const logout = async (req, res) => {
  return res.send("logout");
};

const register = async (req, res) => {
  return res.send("register");
};

module.exports = {
  login,
  logout,
  register,
};
