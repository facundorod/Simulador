import { Injectable } from "@angular/core";

@Injectable()
export class LocalStorageService {

    constructor() { }

    public saveValue(key: string, value: any): void {
        localStorage.setItem(key, value);
    }

    public getValue(key: string): any {
        return localStorage.getItem(key);
    }

    public removeValue(key: string): void {
        localStorage.removeItem(key);
    }
}
