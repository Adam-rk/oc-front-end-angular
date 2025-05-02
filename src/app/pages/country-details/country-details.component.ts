import { Component, OnInit, HostListener, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, of, Subscription } from 'rxjs';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { Olympic } from 'src/app/core/models/Olympic';
import { OlympicService } from 'src/app/core/services/olympic.service';
import { LineChartData } from 'src/app/core/models/LineChartData';

@Component({
  selector: 'app-country-details',
  templateUrl: './country-details.component.html',
  styleUrls: ['./country-details.component.scss']
})
export class CountryDetailsComponent implements OnInit, OnDestroy {
  public olympic$: Observable<Olympic[] | undefined> = of(undefined);
  public lineChartData: LineChartData | undefined;
  private subscription = new Subscription();

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
  public colorScheme: any = {
    domain: ['#008080']
  };

  constructor(
    private route: ActivatedRoute,
    private olympicService: OlympicService,
    private router: Router
  ) { 
    this.onResize();
  }

  @HostListener('window:resize')
  onResize(): void {
    const width = window.innerWidth;
    
    if (width <= 480) {
      this.view = [width - 50, 250];
    } else if (width <= 768) {
      this.view = [width - 60, 300];
    } else if (width <= 992) {
      this.view = [width - 80, 350];
    } else {
      this.view = [Math.min(width - 100, 800), 400];
    }
    
    // Ensure chart width never exceeds viewport width
    if (this.view[0] > width - 30) {
      this.view[0] = width - 30;
    }
  }

  ngOnInit(): void {
    // Initialize the olympic$ observable to ensure the template works
    this.olympic$ = this.olympicService.getOlympics();
    
    // Subscribe to route params and get country details
    this.subscription.add(
      this.route.paramMap.pipe(
        switchMap(params => {
          const olympicId = Number(params.get('id'));
          return this.olympicService.getCountryDetails(olympicId).pipe(
            catchError(error => {
              console.error('Error getting country details:', error);
              this.router.navigate(['/not-found']);
              return of(undefined);
            })
          );
        })
      ).subscribe(data => {
        if (data) {
          this.lineChartData = data;
        }
      })
    );
  }

  goBack(): void {
    this.router.navigate(['/']);
  }
  
  ngOnDestroy(): void {
    // Clean up subscriptions to prevent memory leaks
    this.subscription.unsubscribe();
  }
}
