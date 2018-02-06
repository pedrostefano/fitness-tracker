import { NgModule } from '@angular/core';

import { CommonModule } from '@angular/common/';
import { MaterialModule } from '../material.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule } from '@angular/forms';

@NgModule({
    imports: [
        CommonModule,
        MaterialModule,
        FlexLayoutModule,
        FormsModule
    ],
    exports: [
        CommonModule,
        MaterialModule,
        FlexLayoutModule,
        FormsModule
    ],
    declarations: [],
    providers: [],
})
export class SharedModule { }
