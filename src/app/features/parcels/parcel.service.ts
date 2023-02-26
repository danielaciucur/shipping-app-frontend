import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, throwError } from 'rxjs';
import { ParcelData } from './models/parcel-data.model';
import { Parcel } from './models/parcel.model';
import * as countrycitystatejson from 'countrycitystatejson';
import { SearchFilter } from './models/parcel-search-filter';
import { Country } from './models/country';

@Injectable({
  providedIn: 'root',
})
export class ParcelService {
  readonly parcelApi = 'http://localhost:3000/api/parcels';
  readonly createParcelApi = 'http://localhost:3000/api/parcels/create/';
  readonly removeParcelApi = 'http://localhost:3000/api/parcels/delete/';

  private countryData = countrycitystatejson;

  constructor(private http: HttpClient) {}

  public getParcels(page: number, size: number, filter?: SearchFilter): Observable<ParcelData> {
    const params = new HttpParams()
      .set('page', String(page))
      .set('limit', String(size))
      .set('country', filter.country || '')
      .set('description', filter.description || '');

    return this.http.get<ParcelData>(this.parcelApi, { params }).pipe(
      map((parcels: ParcelData) => parcels),
      catchError((err) => throwError(err))
    );
  }

  public createParcel(parcel: Parcel): Observable<Parcel> {
    return this.http.post<Parcel>(this.createParcelApi, parcel);
  }

  public removeParcel(uuid: string): Observable<void> {
    return this.http.delete<void>(this.removeParcelApi + uuid);
  }

  getCountries(): Country[] {
    return this.countryData.getCountries().map(function (country: any) {
      return {
        name: country.name,
        shortName: country.shortName
      }
    });
  }

  getStatesByCountry(country: string): string[] {
    return this.countryData.getStatesByShort(country);
  }

  getCitiesByState(country: string, state: string): string[] {
    return this.countryData.getCities(country, state);
  }
}
