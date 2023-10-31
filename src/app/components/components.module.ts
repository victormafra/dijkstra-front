import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableComponent } from './table/table.component';
import { PathControlsComponent } from './path-controls/path-controls.component';
import { PathHistoryComponent } from './path-history/path-history.component';
import { ReactiveFormsModule } from '@angular/forms';
import { PathInfoComponent } from './path-info/path-info.component';
import { HeaderComponent } from './header/header.component';

const EXPORT_COMPONENTS = [
  TableComponent,
  PathControlsComponent,
  PathHistoryComponent,
  PathInfoComponent,
  HeaderComponent
]
@NgModule({
  declarations: [
    ...EXPORT_COMPONENTS,
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  exports: [
    ...EXPORT_COMPONENTS
  ]

})
export class ComponentsModule { }
