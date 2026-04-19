const app = require("../app");

module.exports = (req, res) => {
  // Express app acts as Vercel serverless handler
  return app(req, res);
};

