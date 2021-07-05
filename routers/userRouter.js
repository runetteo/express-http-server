const express = require('express');
const { userController } = require('../controllers');

const router = express.Router();

const errorHandler = fn => (req, res, next) => {
  Promise.resolve(fn(req, res, next))
    .catch(err => {
      next(err);
    });
};

router.get('/:username', errorHandler(userController.getUserByUsername));
router.get('/email/:emailAddress', errorHandler(userController.getUserByEmailAddress));

router.put('/:username',
  errorHandler(userController.checkUserExistence),
  errorHandler(userController.checkUsernameOnBody),
  errorHandler(userController.validateEmailFormat),
  errorHandler(userController.checkEmailExistence),
  errorHandler(userController.updateUser)
);

router.delete('/:username',
  errorHandler(userController.checkUserExistence),
  errorHandler(userController.deleteUser)
);

module.exports = router;
