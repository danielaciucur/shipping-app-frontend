import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  OnDestroy,
} from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { BehaviorSubject, catchError, Subject, takeUntil } from 'rxjs';
import { Country } from '../../models/country';
import { Parcel } from '../../models/parcel.model';
import { ParcelService } from '../../parcel.service';

@Component({
  selector: 'app-parcel-new',
  templateUrl: './parcel-new.component.html',
  styleUrls: ['./parcel-new.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ParcelNewComponent implements OnDestroy {
  private readonly _destroy$ = new Subject<boolean>();

  minDate: Date;
  filteredCountryList$ = new BehaviorSubject<Country[]>([]);
  filteredStateList$ = new BehaviorSubject<string[]>([]);
  filteredCityList$ = new BehaviorSubject<string[]>([]);
  public countryList: Country[];
  public stateList: string[];
  public cityList: string[];

  public onSubmitClicked = new EventEmitter<Parcel>();

  createParcelForm = this.formBuilder.group({
    parcelSKU: ['', Validators.required],
    description: [''],
    address: [''],
    town: [{ value: '', disabled: true }],
    state: [{ value: '', disabled: true }],
    country: [{ name: null, shortName: null }],
    deliveryDate: [new Date()],
  });

  constructor(
    private formBuilder: FormBuilder,
    private parcelService: ParcelService,
    private router: Router
  ) {
    this.minDate = new Date();
    this.countryList = this.parcelService.getCountries();
    this.filteredCountryList$.next(this.parcelService.getCountries());
  }

  ngOnInit() {
    this._getFilteredCountries();
    this._getFilteredStates();
    this._getFilteredTowns();
  }

  private _getFilteredCountries() {
    this.createParcelForm.controls.country.valueChanges
      .pipe(takeUntil(this._destroy$))
      .subscribe((result: Country) => {
        this.createParcelForm.controls.state.reset();
        this.createParcelForm.controls.state.disable();
        if (result) {
          this.stateList = this.parcelService.getStatesByCountry(
            this.createParcelForm.controls.country.value.shortName
          );
          this.createParcelForm.controls.state.enable();

          if (result instanceof Country) {
            this.filteredCountryList$.next(
              this._filterCountries(result.name, this.countryList)
            );
          } else {
            this.filteredCountryList$.next(
              this._filterCountries(result, this.countryList)
            );
          }
        } else {
          this.filteredCountryList$.next(this.countryList);
        }
      });
  }

  private _getFilteredStates() {
    this.createParcelForm.controls.state.valueChanges
      .pipe(takeUntil(this._destroy$))
      .subscribe((result: string) => {
        this.createParcelForm.controls.town.reset();
        this.createParcelForm.controls.town.disable();
        if (result) {
          this.cityList = this.parcelService.getCitiesByState(
            this.createParcelForm.controls.country.value.shortName,
            this.createParcelForm.controls.state.value
          );
          this.createParcelForm.controls.town.enable();
          this.filteredStateList$.next(this._filter(result, this.stateList));
        } else {
          this.filteredStateList$.next(this.stateList);
        }
      });
  }

  private _getFilteredTowns() {
    this.createParcelForm.controls.town.valueChanges
      .pipe(takeUntil(this._destroy$))
      .subscribe((result: string) => {
        if (result) {
          this.filteredCityList$.next(this._filter(result, this.cityList));
        } else {
          this.filteredCityList$.next(this.cityList);
        }
      });
  }

  private _filterValue(countryValue: string, searchValue: string) {
    return (
      countryValue.toLowerCase().startsWith(searchValue) ||
      countryValue.startsWith(searchValue) ||
      countryValue.includes(searchValue) ||
      countryValue.toLowerCase().includes(searchValue)
    );
  }

  private _filterCountries(value: string, list: Country[]): Country[] {
    const matchFound = [];
    for (let i = 0; i < list.length; i++) {
      if (this._filterValue(list[i].name, value)) {
        matchFound.push(list[i]);
      }
    }

    return matchFound;
  }

  private _filter(value: string, list: string[]): string[] {
    const matchFound = [];
    for (let i = 0; i < list.length; i++) {
      if (this._filterValue(list[i], value)) {
        matchFound.push(list[i]);
      }
    }

    return matchFound;
  }

  onSubmit() {
    this.parcelService
      .createParcel(this.setParcelModel())
      .subscribe({ complete: () => this.router.navigate(['parcels']) });
  }

  onCancel() {
    this.router.navigate(['parcels']);
  }

  clearCountry() {
    if (this.createParcelForm.controls.country.value.name) {
      this.createParcelForm.controls.country.setValue({
        name: null,
        shortName: null,
      });
      this.createParcelForm.controls.state.disable();
      this.createParcelForm.controls.town.disable();
      this.filteredCountryList$.next(this.countryList);
    }
  }

  clearState() {
    if (this.createParcelForm.controls.state.value) {
      this.createParcelForm.controls.state.setValue('');
      this.createParcelForm.controls.town.disable();
      this.filteredStateList$.next(this.stateList);
    }
  }

  clearTown() {
    if (this.createParcelForm.controls.town.value) {
      this.createParcelForm.controls.town.setValue('');
    }
  }

  getOptionName(option: Country): string {
    return option.name;
  }

  setParcelModel() {
    return new Parcel(
      this.createParcelForm.controls.parcelSKU.value,
      this.createParcelForm.controls.description.value,
      this.createParcelForm.controls.address.value,
      this.createParcelForm.controls.town.value,
      this.createParcelForm.controls.state.value,
      this.createParcelForm.controls.country.value.name,
      this.createParcelForm.controls.deliveryDate.value.toISOString()
    );
  }

  public ngOnDestroy(): void {
    this._destroy$.next(true);
    this._destroy$.unsubscribe();
  }
}
