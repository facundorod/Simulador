class AuthError extends Error {
    constructor() {
        super('You do not access');
        this.name = 'AuthError';
        this.status = 401;
    }

    toJson(){
        return {
            name: this.name,
            status: this.status,
            message: this.message,
        }
    }
}

module.exports = AuthError;