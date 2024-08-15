import { Component } from '@angular/core';
import { SearchEntry } from '../response-structs';
import { StudentService } from '../student.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrl: './search.component.css'
})
export class SearchComponent {
  constructor(private studentService: StudentService) {}
  // dropdown contents
  gradYears: string[] = [];
  statuses: string[] = [];
  programs: string[] = [];
  termNums: string[] = [];
  // search stuff
  searchParams: SearchEntry = {
    lifetimeid: '', uni: '', cnumber: '', lname: '', fname: '', gradyear: '',
    status: '', eterm: '', tnumber: '', program: '', cluster: ''
  };
  searchResults: SearchEntry[] = [];
  selected?: SearchEntry;
  // batch selection stuff
  batchEnable: boolean = false;
  batchSelected: SearchEntry[] = [];
  batchProgram: string = '';
  // tool picker stuff
  selectedTool: number = 0;

  ngOnInit(): void {
    this.getDropdowns();
  }

  selectTool(tool: number): void {
    this.selectedTool = tool;
  }

  updateBatchList(newList: SearchEntry[]): void {
    this.batchSelected = newList;
  }

  getDropdowns(): void {
    // dropdowns from DB entries
    const ddObs = this.studentService.getSearchDropdowns();
    ddObs.subscribe(values => {
      this.statuses = values[0];
      this.programs = values[1];
      this.termNums = values[2];
    });
    // grad year dropdown
    const currentYear = new Date().getFullYear();
    this.gradYears = Array.from({length: (currentYear+8)-1998}, (val,ind) => String(1998+ind));
  }

  searchStudents(): void {
    // make sure at least one param is set
    if (Object.values(this.searchParams).every((val) => val == '')){
      alert('Please enter at least one search item.');
      return;
    }
    // perform the search
    const resultObs = this.studentService.searchStudents(this.searchParams);
    resultObs.subscribe(results => {
      // store the search results
      this.searchResults = results
      // check whether to enable batch processing
      if (results.length <= 1) {
        // if there are 0 or 1 results, no batching
        this.batchEnable = false;
      } else {
        // if there are multiple results, enable batching only if status, eterm, and tnumber match
        let first = results[0];
        if (results.every(val => (
          val.status == first.status && 
          val.eterm == first.eterm &&
          val.tnumber == first.tnumber))
        ){
          this.batchEnable = true;
          this.batchProgram = first.program;
        } else {
          this.batchEnable = false;
          this.batchProgram = '';
        }
      }
    });
  }

  clearFields(): void {
    this.searchParams = {
      lifetimeid: '', uni: '', cnumber: '', lname: '', fname: '', gradyear: '',
      status: '', eterm: '', tnumber: '', program: '', cluster: ''
    };
    this.searchResults = [];
    this.batchEnable = false;
  }
}
