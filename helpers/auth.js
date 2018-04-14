module.exports = {
  ensureAuthenticated: (req, res, next) => {
    if (req.isAuthenticated()) {
      req.next();
    }
    req.flash('error_msg', 'Not Authorized');
    res.redirect('/users/login');
  },
};