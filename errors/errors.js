class ClientError extends Error {
    constructor(message) {
        super();
        this.message = message;
    }

    getErrorCode() {
        if (this instanceof BadRequest) {
            return 400;
        } else if (this instanceof NotFound) {
            return 404;
        } else if (this instanceof UserAlreadyExists) {
            return 409;
        } else {
            return 500;
        }
    }

}

class BadRequest extends ClientError {
    constructor(message) {
        super(message);
        this.name = 'BadRequest';
    }
}

class NotFound extends ClientError {
    constructor(message) {
        super(message);
        this.name = 'UserNotFound';
    }
}
class UserAlreadyExists extends ClientError {
    constructor(message) {
        super(message);
        this.name = 'UserAlreadyExists';
    }
}

module.exports = {
    ClientError,
    BadRequest,
    NotFound,
    UserAlreadyExists
}