import { Component } from '@angular/core';
import { StudentService } from '../student.service';

@Component({
  selector: 'app-sheet-upload',
  templateUrl: './sheet-upload.component.html',
  styleUrl: './sheet-upload.component.css'
})
export class SheetUploadComponent {
  constructor(private studentService: StudentService) {}
  sheetFile: File|null = null;
  successText: boolean = false;

  clearFile(): void {
    this.sheetFile = null;
  }

  readFile(event: any): void {
    const potentialFile = event.target.files[0];
    if (potentialFile) {
      let extension = potentialFile.name.match(/\.([^\.]+)$/)[1];
      if (!(extension == 'xls' || extension == 'xlsx')) {
        alert('Invalid file type!');
        event.target.value = '';
        this.sheetFile = null;
      } else {
        this.successText = false;
        this.sheetFile = potentialFile;
      }
    } else {
      this.sheetFile = null;
    }
  }

  uploadExcel(): void {
    if (this.sheetFile){
      // send excel file to studentService for upload
      const responseObs = this.studentService.uploadExcel(this.sheetFile);

      // wait for request to resolve, then log result
      responseObs.subscribe(response => {
        console.log('%d - %s',response.status,response.message);
        this.successText = response.status == 200;
      });

      // clear stored file once it's been uploaded
      this.sheetFile = null;
    }
  }

  formatBytes(bytes: number): string {
    var decimals = 2;
    var kilobyte = 1000;
    var megabyte = 1000000;
    var gigabyte = 1000000000;

    if(bytes < kilobyte) return bytes + " B";
    else if(bytes < megabyte) return(bytes / kilobyte).toFixed(decimals) + " KB";
    else if(bytes < gigabyte) return(bytes / megabyte).toFixed(decimals) + " MB";
    else return(bytes / gigabyte).toFixed(decimals) + " GB";
  }
}
