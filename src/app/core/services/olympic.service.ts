import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { Olympic } from '../models/Olympic';
import { plainToInstance } from 'class-transformer';

@Injectable({
  providedIn: 'root',
})
export class OlympicService {
  private olympicUrl = './assets/mock/olympic.json';
  private olympics$ = new BehaviorSubject<Olympic[] | undefined>(undefined);

  constructor(private http: HttpClient) { }

  loadInitialData() {
    return this.http.get<Olympic[]>(this.olympicUrl).pipe(
      //TODO: reverifier le code d'avant  
      map(data => plainToInstance(Olympic, data)),
    tap((serializedData: Olympic[]) => {
      // Update the observable with the new serialized data
      this.olympics$.next(serializedData);
    }),
      catchError((error, caught) => {
        console.error(error);
        this.olympics$.next(undefined);
        return caught;
      })
    );
  }

  getOlympics() {
    return this.olympics$.asObservable();
  }

  // getMedalsCountByCountry(id: number) {
  //   //TODO: Complete this method
  //   return this.olympics$.pipe(
  //     map((olympics) => olympics?.find(id))
  //   )
  //   return olympics.map((olympic: any) => {
  //     const totalMedals = olympic.participations.reduce(
  //       (sum: number, participation: any) => sum + participation.medalsCount,
  //       0
  //     );
  //     return { name: olympic.country, value: totalMedals };
  //   });
  // }


  getOlympicById(id: number) {
    return this.olympics$.pipe(
      map((olympics) => {
        const olympic = olympics?.find((olympic) => olympic.id === id);
        if (!olympic) {
          throw new Error(`Olympic with id ${id} not found`);
        }
        return olympic;
      })
    );
  }
}
