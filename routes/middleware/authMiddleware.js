const jwt = require('jsonwebtoken');

const isAuthenticated = (req, res, next) => {
  const token = req.cookies.token;
  if (token) {
    try {
      const decodedToken = jwt.verify(token, process.env.JWT_SECRET); // INPUT_REQUIRED {JWT_SECRET}
      req.userId = decodedToken.id;
      console.log(`User authenticated successfully: ${req.userId}`);
      next();
    } catch (err) {
      console.error(`JWT verification error: ${err.message}`, err);
      res.status(401).send('You are not authenticated');
    }
  } else {
    console.log("No token found, user is not authenticated.");
    res.status(401).send('You are not authenticated');
  }
};

module.exports = {
  isAuthenticated
};