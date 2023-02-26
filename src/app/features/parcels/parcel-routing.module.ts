import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { ParcelListComponent } from "./components/parcel-list/parcel-list.component";
import { ParcelNewComponent } from "./components/parcel-new/parcel-new.component";

const parcelRoutes: Routes = [
    { path: '', component: ParcelListComponent },
    { path: 'parcels/new', component: ParcelNewComponent },
  ];

@NgModule({
    imports: [RouterModule.forChild(parcelRoutes)],
    exports: [RouterModule],
  })
export class ParcelRoutingModule{

}