import { Component } from '@angular/core';
import { SearchEntry } from '../response-structs';
import { StudentService } from '../student.service';
import { Input } from '@angular/core';

@Component({
  selector: 'app-batch-process',
  templateUrl: './batch-process.component.html',
  styleUrl: './batch-process.component.css'
})
export class BatchProcessComponent {
  constructor(private studentService: StudentService) {}
  @Input() entries: SearchEntry[] = [];
  @Input() enable: boolean = false;
  @Input() program: string = '';
  successText: boolean = false;
  newTermNum: string = '';
  // values for dropdown
  termNums: string[] = [];

  ngOnChanges(): void {
    this.successText = false;
    if (this.program){
      const tNumsObs = this.studentService.getTermNums(this.program);
      tNumsObs.subscribe(results => this.termNums = results);
    }
  }

  batchUpdate(): void {
    if (!this.newTermNum) {
      alert('Please select a value.');
    } else {
      const mergedUniString = this.entries.map(entry => entry.uni).join(',');
      const responseObs = this.studentService.batchUpdate(this.newTermNum,mergedUniString);
      responseObs.subscribe(response => {
        console.log('%d - %s',response.status,response.message);
        this.successText = response.status == 200;
      });
    }
  }
}
