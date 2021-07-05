const dataAccess = require('../dataAccess');
const { userDataAccess } = require('../dataAccess');
const { BadRequest, UserAlreadyExists, NotFound } = require('../errors/errors');

/**
 * https://jsdoc.app/
 * @typedef {import('express').Request} Request
 * @typedef {import('express').Response} Response
 * @typedef {import('express').NextFunction} NextFunction
 */

/**
 * Gets user by username
 * @param {Request} req
 * @param {Response} res
 * @param {NextFunction} next
 */
const getUserByUsername = async (req, res, next) => {
  const username = req.params.username;

  const user = await userDataAccess.getUserByUsername(username);

  if (!user) {
    throw new NotFound(`User ${username} does not exist.`);
  }

  res.send(user);
};

/**
 * Gets user by email address
 * @param {Request} req
 * @param {Response} res
 * @param {NextFunction} next
 */
const getUserByEmailAddress = async (req, res, next) => {
  const emailAddress = req.params.emailAddress;

  const user = await userDataAccess.getUserByEmailAddress(emailAddress);

  if (!user) {
    throw new NotFound(`User with email ${emailAddress} does not exist.`);
  }

  res.send(user);
};

/**
 * Checks if user to be updated/deleted is existing. Uses username only for checking.
 * @param {Request} req
 * @param {Response} res
 * @param {NextFunction} next
 */
const checkUserExistence = async (req, res, next) => {
  const username = req.params.username;

  const user = await userDataAccess.getUserByUsername(username);
  if (user) {
    return next();
  }

  throw new NotFound(`User ${username} does not exist.`);
};

/**
 * Checks if username property exists on the request body. This is used for PUT requests.
 * @param {Request} req
 * @param {Response} res
 * @param {NextFunction} next
 */
const checkUsernameOnBody = (req, res, next) => {
  const username = req.body.username;
  if (!username) {
    return next();
  }

  throw new BadRequest(`Username cannot be on request body.`);
};

/**
 * Checks if email address in the request body has a valid format. 
 * @param {Request} req
 * @param {Response} res
 * @param {NextFunction} next
 */
const validateEmailFormat = (req, res, next) => {
  const emailAddress = req.body.emailAddress;
  const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  const isEmailValid = re.test(String(emailAddress).toLowerCase());
  if (emailAddress && !isEmailValid) {
    throw new BadRequest(`Email ${emailAddress} is invalid.`);
  }

  next();

};

/**
 * Checks if email address in the request body already belongs to an existing user.
 * @param {Request} req
 * @param {Response} res
 * @param {NextFunction} next
 */
const checkEmailExistence = async (req, res, next) => {
  const emailAddress = req.body.emailAddress;

  if (emailAddress) {

    const isAlreadyUsed = await userDataAccess.getUserByEmailAddress(emailAddress);
    if (isAlreadyUsed) {
      throw new UserAlreadyExists(`Email ${emailAddress} already exists.`);
    }

  }

  next();
};



/**
 * Updates user
 * @param {Request} req
 * @param {Response} res
 * @param {NextFunction} next
 */
const updateUser = async (req, res, next) => {
  const username = req.params.username;
  const payload = req.body;

  await userDataAccess.update(username, payload);

  return res.status(200).json({
    code: 200,
    status: 'Success',
    message: `Updated ${username}.`
  });

};

/**
 * Deletes user
 * @param {Request} req
 * @param {Response} res
 * @param {NextFunction} next
 */
const deleteUser = async (req, res, next) => {
  const username = req.params.username;

  await userDataAccess.delete(username);

  return res.status(200).json({
    code: 200,
    status: 'Success',
    message: `Deleted ${username}.`
  });
};

module.exports = {
  getUserByUsername,
  getUserByEmailAddress,
  checkUserExistence,
  checkUsernameOnBody,
  validateEmailFormat,
  checkEmailExistence,
  updateUser,
  deleteUser
};
