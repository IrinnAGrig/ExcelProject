import { Component } from '@angular/core';
import { ExcelToJsonService } from '../shared/services/excell/excell.service';
import { Router } from '@angular/router';
import { PdfExcelService } from '../shared/services/excell/pdf-excel.service';

export interface FileUpload {
  file: File;
  progress: number;
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  files: FileUpload[] = [];
  isExcell = true;

  constructor(private excelToJsonService: ExcelToJsonService, private router: Router, private pdfExcellService: PdfExcelService) {

  }
  onFileDropped($event: any, type: string) {
    type == 'pdf' ? this.isExcell = false : this.isExcell = true;
    this.prepareFilesList($event);
  }

  fileBrowseHandler(filesdata: any, type: string) {
    type == 'pdf' ? this.isExcell = false : this.isExcell = true;
    const files = filesdata.target.files;
    if (files) {
      this.prepareFilesList(files);
      filesdata.target.value = null;
    }
  }

  manageFile() {
    if (this.files.length === 0) {
      console.error('No file selected');
      return;
    }
    const file: File = this.files[0].file;
    this.excelToJsonService.saveExcelDataToFile(file).then(() => this.router.navigate(['/dashboard/new-file']))
  }
  manageFilePDF() {
    if (this.files.length === 0) {
      console.error('No file selected');
      return;
    }
    const file: File = this.files[0].file;
    this.pdfExcellService.processPDF(file)
      .then(() => {
        console.log('PDF file processed successfully');
        this.router.navigate(['/dashboard/new-file'])
      })
      .catch((error) => {
        console.error('Error processing PDF file:', error);
      });
  }


  deleteFile() {
    this.files = [];
  }

  uploadFilesSimulator(index: number) {
    setTimeout(() => {
      if (index === this.files.length) {
        return;
      } else {
        const progressInterval = setInterval(() => {
          if (this.files[index].progress === 100) {
            clearInterval(progressInterval);
            this.uploadFilesSimulator(index + 1);
          } else {
            this.files[index].progress += 5;
          }
        }, 20);
      }
    }, 500);
  }


  prepareFilesList(files: FileList) {
    this.files = [];
    for (let i = 0; i < files.length; i++) {
      this.files.push({ file: files[i], progress: 0 });
    }
    this.uploadFilesSimulator(0);
  }

}
