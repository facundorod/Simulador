class GeneralError extends Error {
    constructor() {
        super('An error has occurred');
        this.name = 'GeneralError';
        this.status = 500;
    }

    toJson(){
        return {
            name : this.name,
            status : this.status,
            message : this.message
        }
    }
}

module.exports = GeneralError;