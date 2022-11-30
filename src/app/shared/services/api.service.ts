import { environment } from '@environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, Subject, BehaviorSubject, Subscription } from 'rxjs';
import { throwError } from 'rxjs';

@Injectable()
export class ApiService {
    private baseUrl: string;

    constructor(private http: HttpClient, private router: Router) {
        this.baseUrl = environment.api.baseUrl;
    }

    /**
     * Create http headers object
     * @mockapi boolean If true, then dont add token since it fails
     * @returns {Headers}
     */
    private getHttpHeaders(uploadFile: boolean = false): HttpHeaders {
        let headers = new HttpHeaders();

        if (!uploadFile) {
            headers = headers.set('Accept', 'application/json');
            headers = headers.set('Content-Type', 'application/json');
            headers = headers.set('Access-Control-Allow-Origin',  '*');
            headers = headers.set(
                'Language',
                localStorage.getItem('activeLang')
                    ? localStorage.getItem('activeLang')
                    : 'en'
            );
        } else {
            // headers.append('enctype', 'multipart/form-data');
            headers = headers.set(
                'Language',
                localStorage.getItem('activeLang')
                    ? localStorage.getItem('activeLang')
                    : 'en'
            );
        }

        return headers;
    }

    /**
     * HTTP Get
     * @param res
     * @param baseUrl
     * @returns {Observable<R>}
     */
    httpGet(res: string, baseUrl: string = null) {
        const subject = new Subject<any>();

        if (baseUrl) {
            let headers = new HttpHeaders();
            headers = headers.set(
                'Accept',
                'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3'
            );

            this.http.get(baseUrl + res, { headers }).subscribe(
                (data: any) => {
                    subject.next(data);
                },
                (err: any) => {
                    subject.error(err.error || { msg: 'System error' });
                }
            );
        } else {
            // Add timestamp to avoid cache
            if (res.indexOf('?') >= 0) {
                res += '&';
            } else {
                res += '?';
            }
            res += '_t=' + new Date().getTime();

            this.http
                .get(this.baseUrl + res, { headers: this.getHttpHeaders() })
                .subscribe(
                    (data: any) => {
                        subject.next(data);
                    },
                    (err: any) => {
                        this.handleError(
                            err,
                            { method: 'GET', endpoint: res },
                            this
                        ).subscribe(
                            (data) => {
                                subject.next(data);
                            },
                            (err: any) => {
                                subject.error(err);
                            }
                        );
                    }
                );
        }

        return subject.asObservable();
    }

    /**
     * HTTP Post
     * @param res
     * @param dataPost
     * @param baseUrl
     * @returns {Observable<R>}
     */
    httpPost(res, dataPost, baseUrl: string = null): Observable<any> {
        const subject = new Subject<any>();

        let json = null;
        if (dataPost) {
            json = JSON.stringify(dataPost);
        }

        this.http
            .post((baseUrl ? baseUrl : this.baseUrl) + res, json, {
                headers: this.getHttpHeaders(),
            })
            .subscribe(
                (data: any) => {
                    subject.next(data);
                },
                (err: any) => {
                    if (!baseUrl) {
                        subject.error(err.error || { msg: 'System error' });
                    } else { subject.error(err); }
                },
                () => {
                    subject.complete();
                }
            );

        return subject.asObservable();
    }

    /**
     * HTTP Put
     * @param res
     * @param dataPost
     * @param localApi
     * @returns {Observable<R>}
     */
    httpPut(res, dataPost): Observable<any> {
        const subject = new Subject<any>();

        const json = JSON.stringify(dataPost);
        this.http
            .put(this.baseUrl + res, json, { headers: this.getHttpHeaders() })
            .subscribe(
                (data: any) => {
                    subject.next(data);
                },
                (err: any) => {
                    subject.error(err.error || { msg: 'System error' });
                },
                () => {
                    subject.complete();
                }
            );

        return subject.asObservable();
    }

    /**
     * HTTP Delete
     * @param res
     * @param attempts
     * @returns {Observable<R>}
     */
    httpDelete(res, mockapi: boolean = false): Observable<any> {
        const subject = new Subject<any>();

        this.http
            .delete(this.baseUrl + res, { headers: this.getHttpHeaders() })
            .subscribe(
                (data: any) => {
                    subject.next(data);
                },
                (err: any) => {
                    subject.error(err);
                }
            );

        return subject.asObservable();
    }

    /**
     * Handle error
     * @param error
     * @returns {any}
     */
    private handleError(error: any, request: any = null, that: any = null) {
        if (error && error.json) { return throwError(error.json()); } else { return throwError({ msg: 'Server error' }); }
    }
}
