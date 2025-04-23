import { Expose, Type } from "class-transformer";
import { Participation } from "./Participation";


export class Olympic {

    public id: number;


    public country: string;

    @Type(() => Participation)

    public participations: Participation[];

    constructor(id: number, country: string, participations: Participation[]) {
        this.id = id;
        this.country = country;
        this.participations = participations;
    }
}