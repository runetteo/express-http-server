const express = require('express');
const { usersController } = require('../controllers');

const router = express.Router();

const errorHandler = fn => (req, res, next) => {
  Promise.resolve(fn(req, res, next))
    .catch(err => {
      next(err);
    });
};

router.get('/', errorHandler(usersController.getAllUsers));

router.post('/',
  errorHandler(usersController.validateRequestRequiredPayload),
  errorHandler(usersController.validateEmailAddress),
  errorHandler(usersController.validateUser),
  errorHandler(usersController.insertUser)
);

module.exports = router;
