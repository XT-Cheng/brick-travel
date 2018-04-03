import { NgModule, Optional, SkipSelf, ModuleWithProviders } from "@angular/core";
import { CommonModule } from "@angular/common";
import { throwIfAlreadyLoaded } from "../utils/module-import-guard";
import { AMapComponent } from "./components/a-map.component";
import { InformationWindowComponent } from "./components/information-window/information-window.component";
import { RateComponent } from "./components/rate/rate.component";
import { ViewPointMarkerComponent } from "./components/viewpoint-marker/viewpoint-marker.component";

const COMPONENTS = [
    AMapComponent,
    InformationWindowComponent,
    RateComponent,
    ViewPointMarkerComponent
]

const ENTRY_COMPONENTS = [
    InformationWindowComponent,
    ViewPointMarkerComponent
]

@NgModule({
    imports: [
        CommonModule
    ],
    declarations: [
        COMPONENTS
    ],
    exports: [
        COMPONENTS
    ],
    entryComponents: [
        ENTRY_COMPONENTS
    ]
})
export class AMapModule {
    constructor(@Optional() @SkipSelf() parentModule: AMapModule) {
        throwIfAlreadyLoaded(parentModule, 'AMapModule');
    }
}