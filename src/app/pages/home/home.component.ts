import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ChartData } from 'src/app/core/models/ChartData';
import { OlympicService } from 'src/app/core/services/olympic.service';



@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit, OnDestroy {
  public chartData: ChartData[] = [];
  public numberOfJOs = 0;
  public numberOfCountries = 0;
  private subscription = new Subscription();



  constructor(
    private olympicService: OlympicService,
    private router: Router
  ) { }

  ngOnDestroy(): void {
    // Clean up subscriptions to prevent memory leaks
    this.subscription.unsubscribe();
  }


  ngOnInit(): void {
    // Subscribe directly to the getHomePageData method
    this.subscription.add(
      this.olympicService.getHomePageData().subscribe(data => {
        this.chartData = data.chartData;
        this.numberOfJOs = data.numberOfJOs;
        this.numberOfCountries = data.numberOfCountries;
      })
    );
  }

  // Handle click on pie chart slice
  onSelect(event: { name: string }): void {
    const selectedData = this.chartData.find(data => data.name === event.name);
    if (selectedData && selectedData.id) {
      this.router.navigate(['/country', selectedData.id]);
    }
  }
}
