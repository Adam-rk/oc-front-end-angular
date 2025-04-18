import { Expose } from "class-transformer";

export class Participation {
    @Expose()
    public id: number;

    @Expose()
    public year: number;

    @Expose()
    public city: string;

    @Expose()
    public medalsCount: number;

    @Expose()
    public athleteCount: number;

    constructor(id: number, year: number, city: string, medalsCount: number, athleteCount: number) {
        this.id = id;
        this.year = year;
        this.city = city;
        this.medalsCount = medalsCount;
        this.athleteCount = athleteCount;
    }
}