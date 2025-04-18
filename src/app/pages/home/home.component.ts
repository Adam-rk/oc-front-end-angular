import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { map } from 'rxjs/operators';
import { Olympic } from 'src/app/core/models/Olympic';
import { Participation } from 'src/app/core/models/Participation';
import { OlympicService } from 'src/app/core/services/olympic.service';

interface ChartData {
  name: string;
  value: number;
  id?: number; // Add Olympic ID for navigation
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  public chartData: ChartData[] = [];
  public numberOfJOs = 0;
  public numberOfCountries = 0;



  constructor(
    private olympicService: OlympicService,
    private router: Router
  ) { }

  ngOnDestroy(): void {
    //TODO: Unsub from observable
  }


  ngOnInit(): void {
    // Subscribe to the olympicService to get the data

    this.olympicService.getOlympics().pipe(
      map((olympics) => {
        if (!olympics) {
          return [];
        }

        let totalJOs = 0;
        olympics.forEach((olympic: Olympic) => {
          totalJOs += olympic.participations.length;
        });
        this.numberOfJOs = totalJOs;

        this.numberOfCountries = olympics.length;

        return olympics.map((olympic: Olympic) => {
          const totalMedals = olympic.participations.reduce(
            (sum: number, participation: Participation) => sum + participation.medalsCount,
            0
          );
          return { name: olympic.country, value: totalMedals, id: olympic.id };
        });
      })
    ).subscribe((data) => {
      this.chartData = data;
    });

    this.olympicService.loadInitialData().subscribe();
  }

  // Handle click on pie chart slice
  onSelect(event: any): void {
    const selectedData = this.chartData.find(data => data.name === event.name);
    if (selectedData && selectedData.id) {
      this.router.navigate(['/country', selectedData.id]);
    }
  }
}
