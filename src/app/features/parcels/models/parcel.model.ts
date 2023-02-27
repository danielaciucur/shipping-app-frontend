export class Parcel {
  uuid?: string;
  parcelSKU?: string;
  description?: string;
  address?: string;
  town?: string;
  state?: string;
  country?: string;
  deliverydate?: string;

  constructor(
    parcelSKU: string,
    description: string,
    address: string,
    town: string,
    state: string,
    country: string,
    deliverydate: string
  ) {
    this.parcelSKU = parcelSKU;
    this.description = description;
    this.address = address;
    this.town = town;
    this.state = state;
    this.country = country;
    this.deliverydate = deliverydate;
  }
}
