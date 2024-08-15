import { Component, Input, Output, EventEmitter, HostListener, ViewChild, ElementRef } from '@angular/core';

@Component({
  selector: 'app-form-date',
  templateUrl: './form-date.component.html',
  styleUrl: './form-date.component.css'
})
export class FormDateComponent {
  @ViewChild('inputField') inputField!: ElementRef;
  @Input({required: true}) enable!: boolean;
  @Input({required: true}) initial!: Date|null;
  @Input({required: true}) minDate!: Date|null;
  @Output() valueUpdated = new EventEmitter<Date>();
  updating: boolean = false;
  active: boolean = false;
  value: string = '';

  ngOnChanges(): void {
    this.updating = false;
  }

  dateToString(rawDate: Date|null): string {
    if (rawDate == null) return '';
    return new Date(rawDate).toISOString().split("T")[0];
  }

  isDirty(): boolean {
    return this.value != this.dateToString(this.initial);
  }

  @HostListener('keyup.enter')
  activate(): void {
    if (this.enable){
      this.value = this.dateToString(this.initial);
      this.active = true;
      setTimeout(() => this.inputField.nativeElement.focus(), 0);
    }
  }

  submitValue(): void {
    if (this.isDirty()){
      this.updating = true;
      this.valueUpdated.emit(new Date(this.value+'T00:00:00'));
    }
    this.active = false;
  }
}

