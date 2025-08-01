const jwt = require('jsonwebtoken');

module.exports = (Model) => {
  return async (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'No token provided' });

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await Model.findById(decoded.id);
      if (!user) return res.status(404).json({ message: 'User not found' });

      req.user = user;
      next();
    } catch (err) {
      res.status(401).json({ message: 'Invalid token' });
    }
  };
};
