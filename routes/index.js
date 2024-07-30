const router = require("express").Router();
const apiRoutes = require("./api-routes");

router.use("/api", apiRoutes);

router.use((req, res) => {
  return res.send("Invalid route. Please check the URL and try again.");
});

module.exports = router;