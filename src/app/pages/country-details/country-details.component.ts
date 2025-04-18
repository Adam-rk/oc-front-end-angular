import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { Olympic } from 'src/app/core/models/Olympic';
import { Participation } from 'src/app/core/models/Participation';
import { OlympicService } from 'src/app/core/services/olympic.service';

interface LineChartData {
  name: string;
  series: { name: string; value: number }[];
}

@Component({
  selector: 'app-country-details',
  templateUrl: './country-details.component.html',
  styleUrls: ['./country-details.component.scss']
})
export class CountryDetailsComponent implements OnInit {
  public olympic$: Observable<Olympic | undefined> = of(undefined);
  public countryName: string = '';
  public numberOfEntries: number = 0;
  public totalMedals: number = 0;
  public totalAthletes: number = 0;
  public lineChartData: LineChartData[] = [];

  // Chart options
  public view: [number, number] = [800, 400];
  public showXAxis = true;
  public showYAxis = true;
  public gradient = false;
  public showLegend = false;
  public showXAxisLabel = true;
  public xAxisLabel = 'Dates';
  public showYAxisLabel = false;
  public yAxisLabel = 'Medals';
  public timeline = false;

  constructor(
    private route: ActivatedRoute,
    private olympicService: OlympicService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.olympic$ = this.route.paramMap.pipe(
      switchMap(params => {
        const olympicId = Number(params.get('id'));
        return this.olympicService.getOlympicById(olympicId).pipe(
          catchError(() => {
            this.router.navigate(['/']);
            return of(undefined);
          })
        );
      }),
      map(olympic => {
        if (olympic) {
          this.countryName = olympic.country;
          this.numberOfEntries = olympic.participations.length;
          this.totalMedals = olympic.participations.reduce(
            (sum, participation) => sum + participation.medalsCount,
            0
          );
          this.totalAthletes = olympic.participations.reduce(
            (sum, participation) => sum + participation.athleteCount,
            0
          );
          
          // Prepare line chart data
          this.lineChartData = [
            {
              name: olympic.country,
              series: olympic.participations
                .sort((a, b) => a.year - b.year)
                .map(participation => ({
                  name: participation.year.toString(),
                  value: participation.medalsCount
                }))
            }
          ];
        }
        return olympic;
      })
    );
  }

  goBack(): void {
    this.router.navigate(['/']);
  }
}
