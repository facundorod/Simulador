class SpecificError extends Error {
    constructor(status, message){
        super(message);
        this.message = message;
        this.status = status;
        this.name = 'SpecificError';
    }

    toJson(){
        return {
            name : this.name,
            status : this.status,
            message : this.message
        }
    }
}