import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { Router } from '@angular/router';
import {
  BehaviorSubject,
  map,
  of,
  Subject,
  switchMap,
  takeUntil,
} from 'rxjs';
import { Country } from '../../models/country';
import { SearchFilter } from '../../models/parcel-search-filter';
import { ParcelService } from '../../parcel.service';
import { ConfirmDialogComponent } from '../../../../shared/components/confirm-dialog/confirm-dialog.component';
import { ParcelResponse } from '../../models/parcel-response.model';

@Component({
  selector: 'app-parcel-list',
  templateUrl: './parcel-list.component.html',
  styleUrls: ['./parcel-list.component.scss'],
})
export class ParcelListComponent implements OnInit, OnDestroy {
  private readonly _destroy$ = new Subject<boolean>();

  searchValue: string;
  dataSource: ParcelResponse = null;
  pageEvent: PageEvent;
  displayedColumns: string[] = [
    'parcelSKU',
    'description',
    'address',
    'town',
    'state',
    'country',
    'deliveryDate',
    'actions'
  ];
  pageSize = 10;
  countries: Country[];
  cities: string[];
  countryControl = new FormControl();
  filteredOptions$ = new BehaviorSubject<Country[]>([]);

  constructor(
    private parcelService: ParcelService,
    public dialog: MatDialog,
    private router: Router
  ) {
    this.countryControl = new FormControl({ name: null, shortName: null });
    this.initDataSource();
    this.countries = this.parcelService.getCountries();
    this.filteredOptions$.next(this.countries);
  }

  ngOnInit() {
    this.countryControl.valueChanges
      .pipe(takeUntil(this._destroy$))
      .subscribe((result: Country) => {
        if (result) {
          if (result instanceof Country) {
            this.filteredOptions$.next(this._filter(result.name));
          } else {
            this.filteredOptions$.next(this._filter(result));
          }
        }
      });
  }

  openDialog(uuid: string) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: { message: 'Are you sure you want to delete this item?' }
    });

    const sub = dialogRef.afterClosed().pipe(switchMap(
      (result) => {
        if (result) {
          return this.parcelService.removeParcel(uuid);
        } else {
          return of();
        }
      }
    ));

    sub.subscribe(() => this.initDataSource());
  }

  getOptionName(option: Country): string {
    return option.name;
  }

  private _filter(value: string): Country[] {
    const matchFound = [];
    for (let i = 0; i < this.countries.length; i++) {
      if (
        this.countries[i].name.toLowerCase().startsWith(value) ||
        this.countries[i].name.startsWith(value)
      ) {
        matchFound.push(this.countries[i]);
      }
    }

    return matchFound;
  }

  clearCountry() {
    if (this.countryControl.value) {
      this.countryControl.setValue({ name: null, shortName: null });
      this.filteredOptions$.next(this.countries);
      this.initDataSource();
    }
  }

  initDataSource() {
    this.updateList(1, 10);
  }

  onPaginateChange(event: PageEvent) {
    let page = event.pageIndex + 1;
    let size = event.pageSize;

    if (this.searchValue || this.countryControl.value) {
      this.updateList(
        page,
        size,
        this.searchValue,
        this.countryControl.value.name
      );
    } else {
      this.updateList(page, size);
    }
  }

  fetchData() {
    this.updateList(1, 10, this.countryControl.value.name, this.searchValue);
  }

  redirectToParcelNew() {
    this.router.navigate(['parcels/new']);
  }

  updateList(
    page: number,
    size: number,
    country?: string,
    description?: string
  ) {
    this.parcelService
      .getParcels(page, size, new SearchFilter(country, description))
      .pipe(map((parcelData: ParcelResponse) => (this.dataSource = parcelData)))
      .subscribe();
  }

  ngOnDestroy(): void {
    this._destroy$.next(true);
    this._destroy$.complete();
  }
}
