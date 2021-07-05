const express = require('express');
const { ClientError } = require('./errors/errors');
const app = express();
const { usersRouter, userRouter } = require('./routers');

app.use(express.urlencoded({ extended: true }));
app.use(express.raw({ type: 'text/html' }));
app.use(express.raw({ type: 'text/xml' }));
app.use(express.json());

app.use('/users', usersRouter);
app.use('/users/user', userRouter);

app.use(function (err, req, res, next) {
  if (err instanceof ClientError) {
    const errorCode = err.getErrorCode();
    return res.status(errorCode).json({
      code: errorCode,
      status: err.name,
      message: err.message
    });
  }

  return res.status(500).json({
    code: 500,
    status: 'UnknownError',
    message: err.message
  });
})

const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`Server is now up listening on port ${port}`);
});
