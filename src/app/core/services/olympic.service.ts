import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { catchError, map, tap, switchMap } from 'rxjs/operators';
import { Olympic } from '../models/Olympic';
import { plainToInstance } from 'class-transformer';
import { LineChartData } from '../models/LineChartData';
import { ChartData } from '../models/ChartData';
import { Participation } from '../models/Participation';

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
  
  /**
   * Get chart data for the home page
   * @returns Observable with chart data, number of JOs, and number of countries
   */
  getHomePageData(): Observable<{
    chartData: ChartData[],
    numberOfJOs: number,
    numberOfCountries: number
  }> {
    // Check if data is loaded, if not, load it first
    const currentValue = this.olympics$.getValue();
    
    // If no data is available, load it first and then process the request
    if (!currentValue || currentValue.length === 0) {
      console.log('Olympic data not loaded yet, loading it first');
      return this.loadInitialData().pipe(
        // After loading data, continue with getting home page data
        switchMap(() => this.olympics$),
        map(olympics => this.processHomePageData(olympics))
      );
    }
    
    // If data is already available, just process the request
    return this.olympics$.pipe(
      map(olympics => this.processHomePageData(olympics))
    );
  }
  
  /**
   * Process home page data
   * @param olympics - Array of Olympics to process
   * @returns Object with chart data, number of JOs, and number of countries
   */
  private processHomePageData(olympics: Olympic[] | undefined): {
    chartData: ChartData[],
    numberOfJOs: number,
    numberOfCountries: number
  } {
    if (!olympics || olympics.length === 0) {
      return {
        chartData: [],
        numberOfJOs: 0,
        numberOfCountries: 0
      };
    }
    
    // Calculate total number of JOs
    let totalJOs = 0;
    olympics.forEach((olympic: Olympic) => {
      totalJOs += olympic.participations.length;
    });
    
    // Get number of countries
    const numberOfCountries = olympics.length;
    
    // Create chart data for pie chart
    const chartData = olympics.map((olympic: Olympic) => {
      const totalMedals = olympic.participations.reduce(
        (sum: number, participation: Participation) => sum + participation.medalsCount,
        0
      );
      return { name: olympic.country, value: totalMedals, id: olympic.id };
    });
    
    return {
      chartData,
      numberOfJOs: totalJOs,
      numberOfCountries
    };
  }

  /**
   * Get country details for detail page
   * @param id - ID of the country to get details for
   * @returns Observable with country details
   */
  getCountryDetails(id: number): Observable<LineChartData> {
    // Check if data is loaded, if not, load it first
    const currentValue = this.olympics$.getValue();
    

    if (!currentValue || currentValue.length === 0) {
    
      // If no data is available, load it first and then process the request
      return this.loadInitialData().pipe(
        switchMap(() => this.olympics$),
        map(olympics => {
          if (!olympics || olympics.length === 0) {
            throw new Error('Failed to load Olympic data');
          }
          
          const olympic = this.findOlympicById(olympics, id);
      
          
          return this.processCountryDetails(olympic);
        })
      );
    }
    
    // If data is already available, just process the request
    return this.olympics$.pipe(
      map(olympics => {
        if (!olympics || olympics.length === 0) {
          throw new Error('No Olympic data available');
        }
        
        const olympic = this.findOlympicById(olympics, id);
        
        return this.processCountryDetails(olympic);
      })
    );
  }
  
  /**
   * Process country details for the detail page
   * @param olympic - Olympic object to process
   * @returns LineChartData object with country details
   */
  private processCountryDetails(olympic: Olympic): LineChartData {
    const chartData = [
      {
        name: olympic.country,
        series: olympic.participations
          .sort((a: Participation, b: Participation) => a.year - b.year)
          .map((participation: Participation) => ({
            name: participation.year.toString(),
            value: participation.medalsCount
          }))
      }
    ];
    
    return {
      countryName: olympic.country,
      numberOfEntries: olympic.participations.length,
      totalMedals: olympic.participations.reduce(
        (sum, participation) => sum + participation.medalsCount,
        0
      ),
      totalAthletes: olympic.participations.reduce(
        (sum, participation) => sum + participation.athleteCount,
        0
      ),
      chartData: chartData
    };
  }

  /**
   * Find an Olympic by ID
   * @param olympics - Array of Olympics to search in
   * @param id - ID of the Olympic to find
   * @returns The found Olympic object
   * @throws Error if Olympic with the given ID is not found
   */
  private findOlympicById(olympics: Olympic[], id: number): Olympic {
    const olympic = olympics.find((o: Olympic) => o.id === id);
    if (!olympic) {
      throw new Error(`Olympic with id ${id} not found`);
    }
    return olympic;
  }
}
