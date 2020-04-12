class RegisterError extends Error {
    constructor() {
        super('The entered email already exists');
        this.name = 'RegisterError';
        this.status = 403;
    }

    toJson(){
        return {
            name: this.name,
            status: this.status,
            message: this.message,
        }
    }
}

module.exports = RegisterError;