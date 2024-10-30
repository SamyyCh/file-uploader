// authMiddleware.js
function isAuthenticated(req, res, next) {
    if (req.session && req.session.user) {
      return next();
    }
    res.redirect('/');
  }
  
module.exports = isAuthenticated;
  