const db = require("../../db");

const createPool = async (req, res) => {
  console.log(req.body);
  const newPool = await db.Pool.create({
    creatorName: "No12",
    creatorEmail: "noe.malzieu@gmail.com",
  });
  res.json(newPool);
};

module.exports = { createPool };
