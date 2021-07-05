const { userDataAccess } = require('../dataAccess');
const { UserAlreadyExists, BadRequest } = require('../errors/errors');

/**
 * https://jsdoc.app/
 * @typedef {import('express').Request} Request
 * @typedef {import('express').Response} Response
 * @typedef {import('express').NextFunction} NextFunction
 */

/**
 * Gets all users
 * @param {Request} req
 * @param {Response} res
 * @param {NextFunction} next
 */
const getAllUsers = async (req, res, next) => {
  const users = await userDataAccess.getAll();

  res.send(users);
};

/**
 *
 * @param {Request} req
 * @param {Response} res
 * @param {NextFunction} next
 */
const validateRequestRequiredPayload = (req, res, next) => {
  const payload = req.body;

  const areAllPropsPresent = ['username', 'emailAddress']
    .every(requiredProp => requiredProp in payload);

  if (areAllPropsPresent) {
    return next();
  }

  throw new BadRequest('Username/emailAddress must be present in the payload');
};

/**
 * Checks if the email address has a valid format.
 * @param {Request} req
 * @param {Response} res
 * @param {NextFunction} next
 */
const validateEmailAddress = (req, res, next) => {
  const emailAddress = req.body.emailAddress;
  const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  
  const isEmailValid = re.test(String(emailAddress).toLowerCase());
  if (isEmailValid) {
    return next();
  }

  throw new BadRequest(`Email ${emailAddress} is invalid.`);
  
};

/**
 * Checks if user to be inserted is already existing. Uses username and email address for checking.
 * @param {Request} req
 * @param {Response} res
 * @param {NextFunction} next
 */
 const validateUser = async (req, res, next) => {
  const username = req.body.username;  
  let user = await userDataAccess.getUserByUsername(username);
  if (user) {
    throw new UserAlreadyExists(`User with ${username} username already exists.`);
  }

  const emailAddress = req.body.emailAddress;
  user = await userDataAccess.getUserByEmailAddress(emailAddress);
  if (user) {
    throw new UserAlreadyExists(`User with email ${emailAddress} already exists.`);
  }

  next();
  
};

/**
 * Inserts user
 * @param {Request} req
 * @param {Response} res
 * @param {NextFunction} next
 */
const insertUser = async (req, res, next) => {
  const payload = req.body;

  const user = await userDataAccess.insert(payload);

  res.status(201).send(user);
};

module.exports = {
  getAllUsers,
  validateRequestRequiredPayload,
  validateEmailAddress,
  validateUser,
  insertUser
};
