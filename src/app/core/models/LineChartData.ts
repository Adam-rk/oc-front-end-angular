// Interface for chart data point
export interface ChartDataPoint {
    name: string; // Year
    value: number; // Medal count
}

// Interface for chart series
export interface ChartSeries {
    name: string; // Country name
    series: ChartDataPoint[];
}

// Class for country details and chart data
export class LineChartData {
    public countryName: string;
    public numberOfEntries: number;
    public totalMedals: number;
    public totalAthletes: number;
    public chartData: ChartSeries[];

    constructor(
        countryName: string,
        numberOfEntries: number,
        totalMedals: number,
        totalAthletes: number,
        chartData: ChartSeries[]
    ) {
        this.countryName = countryName;
        this.numberOfEntries = numberOfEntries;
        this.totalMedals = totalMedals;
        this.totalAthletes = totalAthletes;
        this.chartData = chartData;
    }
}