import { Injectable } from "@angular/core";
import { UserI } from "@app/shared/models/userI";
import { ApiService } from "@app/shared/services/api.service";
import { HelperService } from "@app/shared/services/helper.service";
import { environment } from "@environments/environment";
import { Subject } from "rxjs";

@Injectable({
    providedIn: "root",
})
export class UserService {
    constructor(private api: ApiService) {}

    public updateUser(userData: UserI) {
        const subject = new Subject<void>();

        let endpoint = environment.api.user;

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
}
