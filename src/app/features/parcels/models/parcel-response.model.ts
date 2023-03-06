import { Parcel } from "./parcel.model";

export class ParcelResponse {
  items: Parcel[];
  count: number;
  currentPage: number;
  totalPages: number;

  constructor(
    items: Parcel[],
    count: number,
    currentPage: number,
    totalPages: number,
  ) {
    this.items = items;
    this.count = count;
    this.currentPage = currentPage;
    this.totalPages = totalPages;
  }
}
