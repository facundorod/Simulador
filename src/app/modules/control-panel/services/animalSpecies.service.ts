import { AnimalSpeciesI } from '@models/animal-speciesI';
import { ApiService } from './../../../shared/services/api.service';
import { HelperService } from '@app/shared/services/helper.service';
import { environment } from '@environments/environment';
import { Observable, Subject } from 'rxjs';
import { Injectable } from '@angular/core';
import { PaginatedItemI } from '@app/shared/models/paginatedItemsI';

@Injectable()
export class AnimalSpeciesService {
    constructor(private api: ApiService) {}

    /**
     * Return a list of animalSpecies
     * @param query
     * @param order
     */
    public list(query: any = null, order: any = null): Observable<PaginatedItemI<AnimalSpeciesI>> {
        const subject = new Subject<PaginatedItemI<AnimalSpeciesI>>();

        let endpoint = environment.api.animalSpecies;

        if (query) { endpoint += `?${HelperService.getQueryString(query)}`; }
        if (order) {
            const queryParams = HelperService.getOrderQueryString(order);
            if (endpoint.indexOf('?') >= 0) { endpoint += `&${queryParams}`; }
            else { endpoint += `?${queryParams}`; }
        }

        this.api.httpGet(endpoint).subscribe(
            (data: PaginatedItemI<AnimalSpeciesI>) => {
                subject.next(data);
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

    /**
     * Find animalSpecie by id.
     * @param animalSpecieId
     */
    public findById(animalSpecieId: number) {
        const subject = new Subject<any>();

        const endpoint = environment.api.animalSpecies;

        this.api.httpGet(`${endpoint}/${animalSpecieId}`).subscribe(
            (animalSpecies: any) => {
                subject.next(animalSpecies);
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
     * Create a new Animal Specie
     * @param animalSpecie
     */
    public create(animalSpecie: AnimalSpeciesI) {
        const subject = new Subject<any>();

        const endpoint = environment.api.animalSpecies;

        this.api.httpPost(endpoint, animalSpecie).subscribe(
            (animalSpecie: AnimalSpeciesI) => {
                subject.next(animalSpecie);
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

    public updateById(animalSpecieId: number, animalSpecie: AnimalSpeciesI) {
        const subject = new Subject<any>();

        const endpoint = environment.api.animalSpecies + animalSpecieId;

        this.api.httpPut(endpoint, animalSpecie).subscribe(
            (animalSpecie: AnimalSpeciesI) => {
                subject.next(animalSpecie);
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

    public delete(animalSpecieId: number) {
        const subject = new Subject<any>();

        const endpoint = environment.api.animalSpecies + animalSpecieId;

        this.api.httpDelete(endpoint).subscribe(
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
}
