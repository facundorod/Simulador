
class LoginError extends Error {
    constructor() {
        super('The data entered is wrong');
        this.name = 'AuthError';
        this.status = 403;
    }

    toJson(){
        return {
            name: this.name,
            status: this.status,
            message: this.message,
            path: this.path
        }
    }
}

module.exports = LoginError;