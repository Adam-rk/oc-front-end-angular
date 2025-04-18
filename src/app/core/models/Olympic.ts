import { Expose, Type } from "class-transformer";
import { Participation } from "./Participation";


export class Olympic {
    @Expose()
    public id: number;

    @Expose()
    public country: string;

    @Type(() => Participation)
    @Expose()
    public participations: Participation[];

    constructor(id: number, country: string, participations: Participation[]) {
        this.id = id;
        this.country = country;
        this.participations = participations;
    }
}