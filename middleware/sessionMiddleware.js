module.exports = (req, res, next) => {
    res.locals.currentUser = req.session.user;
    if (!req.session.user) {
      if (req.path.startsWith('/auth/login') || req.path.startsWith('/auth/register')) {
        next();
      } else {
        return res.redirect('/auth/login');
      }
    } else {
      next();
    }
  };
  