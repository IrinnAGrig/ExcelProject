import { NgModule } from "@angular/core";
import { ProgressComponent } from "./components/progress/progress.component";
import { CommonModule } from "@angular/common";
import { BytesFormatPipe } from "./pipes/format-bytes.pipe";

@NgModule({
    declarations: [
        ProgressComponent,
        BytesFormatPipe
    ],
    imports: [CommonModule],
    exports: [ProgressComponent, CommonModule, BytesFormatPipe]
})
export class SharedModule { }