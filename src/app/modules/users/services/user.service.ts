import { Injectable } from '@angular/core';
import { RoleI } from '@app/shared/models/roleI';
import { UserI } from '@app/shared/models/userI';
import { ApiService } from '@app/shared/services/api.service';
import { HelperService } from '@app/shared/services/helper.service';
import { environment } from '@environments/environment';
import { Observable, Subject } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class UserService {
    constructor(private api: ApiService) { }

    public updateMyUser(userData: UserI) {
        const subject = new Subject<void>();

        const endpoint = environment.api.user;

        this.api.httpPut(endpoint, userData).subscribe(
            () => {
                subject.next();
            },
            (err: any) => {
                subject.error(err);
            },
            () => {
                subject.complete();
            }
        );

        return subject.asObservable();
    }

    /**
     * Return a list of animalSpecies
     * @param query
     * @param order
     */
    public list(query: any = null, order: any = null) {
        const subject = new Subject<any>();

        let endpoint = environment.api.users;

        if (query) { endpoint += `?${HelperService.getQueryString(query)}`; }
        if (order) {
            const queryParams = HelperService.getOrderQueryString(order);
            if (endpoint.indexOf('?') >= 0) { endpoint += `&${queryParams}`; }
            else { endpoint += `?${queryParams}`; }
        }

        this.api.httpGet(endpoint).subscribe(
            (data: any) => {
                subject.next(data);
            },
            (err: any) => {
                subject.error(err);
            },
            () => {
                subject.complete();
            }
        );

        return subject.asObservable();
    }


    public delete(id_user: number): Observable<void> {
        const subject = new Subject<any>();

        const endpoint = environment.api.user + `/${id_user}`;

        this.api.httpDelete(endpoint).subscribe(
            () => {
                subject.next();
            },
            (err: any) => {
                subject.error(err);
            },
            () => {
                subject.complete();
            }
        );

        return subject.asObservable();
    }

    public getRoles(): Observable<RoleI[]> {
        const subject = new Subject<RoleI[]>();

        const endpoint = environment.api.roles;

        this.api.httpGet(endpoint).subscribe(
            (roles: RoleI[]) => {
                subject.next(roles);
            },
            (err: any) => {
                subject.error(err);
            },
            () => {
                subject.complete();
            }
        );

        return subject.asObservable();
    }

    public updateUser(id_user: number, userData: UserI): Observable<void> {
        const subject = new Subject<void>();

        const endpoint = environment.api.user + `/${id_user}`;

        this.api.httpPut(endpoint, { user: userData }).subscribe(
            () => {
                subject.next();
            },
            (err: Error) => {
                subject.error(err);
            },
            () => {
                subject.complete();
            }
        );

        return subject.asObservable();
    }

    public createUser(userData: UserI): Observable<void> {
        const subject = new Subject<void>();

        const endpoint = environment.api.user;

        this.api.httpPost(endpoint, userData).subscribe(
            () => {
                subject.next();
            },
            (err: Error) => {
                subject.error(err);
            },
            () => {
                subject.complete();
            }
        );

        return subject.asObservable();
    }
}
