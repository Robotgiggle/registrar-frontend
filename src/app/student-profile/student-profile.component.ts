import { Component, Input, Output, EventEmitter } from '@angular/core';
import { StudentService } from '../student.service';
import { StudentInfo, HistoryEntry } from '../response-structs';

@Component({
  selector: 'app-student-profile',
  templateUrl: './student-profile.component.html',
  styleUrl: './student-profile.component.css'
})
export class StudentProfileComponent {
  constructor(
    private studentService: StudentService,
  ) {}
  // student info
  @Input() uni?: string;
  @Output() deselect = new EventEmitter<any>();
  studentInfo?: StudentInfo;
  newComment: string = '';
  // student history
  studentHistory?: HistoryEntry[];
  showHistory: boolean = false;
  // dropdown contents
  gradYears: string[] = [];
  statuses: string[] = [];
  programs: string[] = [];
  termNums: string[] = [];
  countries: string[] = [];
  citzCodes: string[] = [];
  visaCodes: string[] = [];
  divisions: string[] = [];
  
  ngOnInit(): void {
    this.getDropdowns();
  }

  ngOnChanges(): void {
    this.getStudentInfo();
  }

  hidePanel(): void {
    this.uni = undefined;
    this.studentInfo = undefined;
    this.deselect.emit();
  }

  getDropdowns(): void {
    // dropdowns from DB entries
    const ddObs = this.studentService.getProfileDropdowns();
    ddObs.subscribe(values => {
      this.statuses = values[0];
      this.programs = values[1];
      this.countries = values[2];
      this.citzCodes = values[3];
      this.visaCodes = values[4];
      this.divisions = values[5];
    });
    // grad year dropdown
    const currentYear = new Date().getFullYear();
    this.gradYears = Array.from({length: (currentYear+8)-1998}, (val,ind) => String(1998+ind));
    // term number dropdown generated in getStudendInfo
  }

  getStudentInfo(): void {
    if (this.uni){
      const infoObs = this.studentService.getStudentInfo(this.uni);
      infoObs.subscribe(info => {
        // all the actual student data
        this.studentInfo = info;
        // generate list of term numbers for this student's program
        if (info){
          const tNumsObs = this.studentService.getTermNums(info.program);
          tNumsObs.subscribe(results => this.termNums = results);
        }
      });

      // student history
      const historyObs = this.studentService.getStudentHistory(this.uni);
      historyObs.subscribe(history => {
        if (history) {
          this.studentHistory = history;
        }
      });
    }
  }

  updateRecord(key: string, newVal: string|Date): void {
    // send info to StudentService for API request (if newVal is falsy, set it to null)
    const responseObs = this.studentService.updateStudentInfo({
      uni: this.uni, 
      [key]: newVal || null
    });

    // wait for request to resolve, then handle response
    responseObs.subscribe(response => {
      if (response == 'Student Info updated successfully') {
        // if all is well, reload display to show updated value
        this.getStudentInfo();
        // if the user just posted a comment, clear out the comment box
        if (key == 'comment') this.newComment = '';
      } else {
        // if there was a problem, alert the user
        alert('---< WARNING - API ERROR! >---\n' + response);
      }
    });
  }

  gStatusType(): number {
    if (this.studentInfo){
      const status = this.studentInfo.status;
      if (status == 'RG' || status == 'RC') return 1;
      if (status == 'G' || (status == 'FC' && this.studentInfo.gdate != null)) return 2;
      return 0;
    } else {
      return 0;
    }
  }
}
