var express = require('express'),
    router = express.Router(),
    signup = require('../models/users/login.js');

router.post('/login', function(req, res) {
  login.loginUser(req, res, function(err, data) {
    if (err) {
      res.json({ 'error': true, 'message': 'Error logged in' });
    } else {
      res.json({ 'success': true, 'data': data });
    }
  });
});

module.exports = router;
