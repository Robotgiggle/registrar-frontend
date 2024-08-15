import { Component, SimpleChanges } from '@angular/core';
import { SearchEntry } from '../response-structs';
import { Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-student-list',
  templateUrl: './student-list.component.html',
  styleUrl: './student-list.component.css'
})
export class StudentListComponent {
  // result list stuff
  @Input() results: SearchEntry[] = []
  //@Input() deselect: boolean = false;
  @Input() selected?: SearchEntry;
  @Output() selectedChange = new EventEmitter<SearchEntry>();
  // batch selection stuff
  @Input() batchEnable: boolean = false;
  @Output() batchListChanged = new EventEmitter<SearchEntry[]>();
  batchAll: boolean = false;
  batchSelected: SearchEntry[] = [];

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['results']){
      // reset batch-processing list
      this.batchSelected = [];
      this.batchAll = false;
    } else if (changes['deselect']) {
      // de-select the current selected entry
      this.selected = undefined;
    }
  }

  selectEntry(entry: SearchEntry): void {
    this.selected = entry;
    this.selectedChange.emit(entry);
  }

  toggleBatchAll(): void {
    if (this.batchAll){
      // remove all entries from the batch list
      this.batchSelected = [];
    } else {
      // add all entries to the batch list
      this.results.forEach(val => {
        if (this.batchSelected.includes(val)) return;
        this.batchSelected.push(val);
      });
    }
    this.batchAll = !this.batchAll;
    this.batchListChanged.emit(this.batchSelected);
  }

  toggleBatchEntry(entry: SearchEntry): void {
    let index = this.batchSelected.indexOf(entry);
    if (index == -1){
      // add this entry to the batch list
      this.batchSelected.push(entry);
      if (this.results.every(val => this.batchSelected.includes(val))) this.batchAll = true;
    } else {
      // remove this entry from the batch list
      this.batchSelected.splice(index,1);
      this.batchAll = false;
    }
    this.batchListChanged.emit(this.batchSelected);
  }
}