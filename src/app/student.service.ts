import { Injectable } from '@angular/core';
import { Observable, forkJoin, of } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { SearchEntry, StudentInfo, HistoryEntry } from './response-structs';

import { catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class StudentService {
  constructor(private http: HttpClient) {
    this.resetSessionTimer();
  }
  warningTimerID?: number;
  logoutTimerID?: number;

  resetSessionTimer(): void {
    // clear existing timers, if they exist
    window.clearTimeout(this.warningTimerID);
    window.clearTimeout(this.logoutTimerID);
    // start up new timers
    this.warningTimerID = window.setTimeout(() => {
      alert('WARNING - Session will time out in 5 minutes due to inactivity.');
    }, 1500000);
    this.logoutTimerID = window.setTimeout(() => {
      window.location.href = '/accounts/logout/';
    }, 1800000);
  }

  parseSearchDropdownResponse(response: any): string[][] {
    let statuses = [] as string[];
    let programs = [] as string[]; 
    let termNums = [] as string[]; 

    for (const entry of response.status_codes) {
      statuses.push(entry.status);
    }
    for (const entry of response.program_tnumbers) {
      if (programs.indexOf(entry.program) == -1) programs.push(entry.program);
      if (termNums.indexOf(entry.term_number) == -1) termNums.push(entry.term_number);
    }

    termNums.sort().reverse();

    return [statuses, programs, termNums];
  }

  getSearchDropdowns(): Observable<string[][]> {
    // GET search dropdown information from api
    return this.http.get<any>('api/search-dropdowns/')
      .pipe(map(response => this.parseSearchDropdownResponse(response)));
  }

  parseProfileDropdownResponse(response: any): string[][] {
    let output = [] as string[][];
    let statuses = [] as string[];
    let programs = [] as string[];
    let countries = [] as string[];
    let citzCodes = [] as string[];
    let visaCodes = [] as string[];
    let divisions = [] as string[];

    // build status code list
    for (const entry of response.statuses) {
      statuses.push(entry.status);
    }
    // build program list
    for (const entry of response.programs) {
      programs.push(entry.program);
    }
    // build country and citz code lists
    for (const entry of response.citizenships) {
      countries.push(entry.description);
      citzCodes.push(entry.citizenship_code);
    }
    // build visa code list
    for (const entry of response.visaCodes) {
      visaCodes.push(entry.visa_code);
    }
    // build phd division list
    for (const entry of response.phdDivisions) {
      divisions.push(entry.division);
    }

    // add new lists into final list-of-lists
    output.push(statuses);
    output.push(programs);
    output.push(countries);
    output.push(citzCodes);
    output.push(visaCodes);
    output.push(divisions);

    return output;
  }

  getProfileDropdowns(): Observable<string[][]> {
    // GET further dropdown information from api
    return forkJoin({
      //existingLists: this.getSearchDropdowns(),
      statuses: this.http.get<any>('api/statuscodes/'),
      programs: this.http.get<any>('api/programs/'),
      citizenships: this.http.get<any>('api/citizenships/'),
      visaCodes: this.http.get<any>('api/visacodes/'),
      phdDivisions: this.http.get<any>('api/divisions/'),
    }).pipe(map(response => this.parseProfileDropdownResponse(response)));
  }

  parseTermNumsResponse(response: any): string[] {
    let output = [] as string[];
    for (const entry of response) output.push(entry.term_number);
    return output;
  }

  getTermNums(program: string): Observable<string[]> {
    this.resetSessionTimer();
    // GET term numbers from api, for use in batch-updating
    const termNumUrl = 'api/program-tnumbers/?program='+program;
    return this.http.get<any>(termNumUrl).pipe(map(response => this.parseTermNumsResponse(response)));
  }

  searchStudents(params: SearchEntry): Observable<SearchEntry[]> {
    this.resetSessionTimer();
    // GET list of students from api using various url params
    let searchURL = 'api/students/?';
    Object.entries(params).forEach(([param,val]) => {if (val) searchURL += param+'='+val+'&'});
    return this.http.get<any>(searchURL.slice(0,-1));
  }

  parseStudInfoResponses(responses: any): StudentInfo | undefined {
    if ('detail' in responses.studInfo) return undefined;
    let output = responses.studInfo as StudentInfo;
    output.addresses = responses.studAddr;
    output.comments = responses.comments;
    return output;
  }

  getStudentInfo(uni: string): Observable<StudentInfo | undefined> {
    this.resetSessionTimer();
    // GET student info from api by providing uni
    return forkJoin({
      studInfo: this.http.get<any>('api/studinfo/'+uni+'/'),
      studAddr: this.http.get<any>('api/studaddr/'+uni+'/'),
      comments: this.http.get<any>('api/comments/'+uni+'/'),
    }).pipe(map(responses => this.parseStudInfoResponses(responses)))
  }

  getStudentHistory(uni: string): Observable<HistoryEntry[]> {
    this.resetSessionTimer();
    // GET student update history from api by providing uni
    return this.http.get<any>('api/history/'+uni+'/');
  }

  updateStudentInfo(newInfo: any): Observable<string> {
    this.resetSessionTimer();
    // PATCH updated info into student record
    const updateStudURL = 'api/updatestud/'+newInfo.uni;
    return this.http.patch<any>(updateStudURL,newInfo,{observe:'response'}).pipe(
      map(response => response.body.message),
      catchError(error => of(error.message))
    );
  }

  batchUpdate(newTermNum: string, mergedUnis: string): Observable<{status: number, message: string}> {
    this.resetSessionTimer();
    // POST new term number to all relevant student entries
    const batchUpdateURL = 'api/batchupdate/';
    return this.http.post<any>(batchUpdateURL,{
      tnumber: newTermNum,
      unis: mergedUnis
    },{observe:'response'}).pipe(map(response => {
      return {status: response.status, message: response.body.message};
    }));
  }

  uploadExcel(sheetFile: File): Observable<{status: number, message: string}> {
    this.resetSessionTimer();
    // POST excel sheet containing new data
    const formData = new FormData();
    formData.append('file', sheetFile, sheetFile.name);
    return this.http.post<any>('api/batchupload/', formData, {observe:'response'}).pipe(map(response => {
      return {status: response.status, message: response.body.message};
    }));
  }
}