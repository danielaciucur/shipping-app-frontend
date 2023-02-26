export class SearchFilter {
    country?: string;
    description?: string;

    constructor(country: string, description: string) {
        this.country = country;
        this.description = description;
    }
}