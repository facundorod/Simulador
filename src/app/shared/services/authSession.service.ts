import { BehaviorSubject, Observable } from "rxjs";

export class AuthSession {
    static _authUser: BehaviorSubject<any> = new BehaviorSubject(null);
    static readonly authUser$: Observable<any> = AuthSession._authUser.asObservable();

    constructor() {}

    /**
     * Log out user
     */
    static logOut() {
        if (localStorage.getItem("authUser"))
            localStorage.removeItem("authUser");
        if (localStorage.getItem("authToken"))
            localStorage.removeItem("authToken");
        if (localStorage.getItem("Simulation"))
            localStorage.removeItem("Simulation");
        AuthSession._authUser.next(null);
    }

    /**
     * Save Auth User in local storage
     * @param authUser
     */
    static saveAuthUser(authUser: any) {
        localStorage.setItem("authUser", JSON.stringify(authUser));
        AuthSession._authUser.next(authUser);
    }

    /**
     * Save Auth token
     * @param authToken
     */
    static saveAuthToken(authToken) {
        localStorage.setItem("authToken", authToken);
    }

    /**
     * Get Auth User
     */
    static getAuthUser() {
        if (localStorage.getItem("authUser")) {
            try {
                const authUser = JSON.parse(localStorage.getItem("authUser"));
                return authUser;
            } catch (err) {
                return null;
            }
        }
        return null;
    }

    /**
     * Return auth token
     */
    static getAuthToken(): string {
        if (localStorage.getItem("authToken")) {
            try {
                return localStorage.getItem("authToken");
            } catch (err) {
                return null;
            }
        }
        return null;
    }
}
