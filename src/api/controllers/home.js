const db = require("../../db");

const home = async (req, res) => {
  const user = await db.User.findOne();
  res.json(user);
};

module.exports = { home };
