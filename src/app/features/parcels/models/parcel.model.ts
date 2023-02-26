export class Parcel {
  uuid?: string;
  parcelSKU?: string;
  description?: string;
  address?: string;
  town?: string;
  state?: string;
  country?: string;
  deliveryDate?: Date;

  constructor(
    parcelSKU: string,
    description: string,
    address: string,
    town: string,
    state: string,
    country: string,
    deliveryDate: Date
  ) {
    this.parcelSKU = parcelSKU;
    this.description = description;
    this.address = address;
    this.town = town;
    this.state = state;
    this.country = country;
    this.deliveryDate = deliveryDate;
  }
}
