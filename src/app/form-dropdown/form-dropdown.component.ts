import { Component, Input, Output, EventEmitter, HostListener, ViewChild, ElementRef } from '@angular/core';

@Component({
  selector: 'app-form-dropdown',
  templateUrl: './form-dropdown.component.html',
  styleUrl: './form-dropdown.component.css'
})
export class FormDropdownComponent {
  @ViewChild('inputField') inputField!: ElementRef;
  @Input({required: true}) enable!: boolean;
  @Input({required: true}) initial!: string|null;
  @Input({required: true}) allVals!: string[];
  @Input() nullVal: string = '';
  @Output() valueUpdated = new EventEmitter<string>();
  hovered: boolean = false;
  active: boolean = false;
  value: string = '';

  // TODO: add handling for null value in dropdown
  // pass in a display value for the null entry
  
  isDirty(): boolean {
    return this.value != (this.initial ?? '');
  }

  @HostListener('keyup.enter')
  activate(): void {
    if (this.enable){
      this.value = this.initial ?? '';
      this.active = true;
      setTimeout(() => this.inputField.nativeElement.focus(), 0);
    }
  }

  submitValue(): void {
    if (this.isDirty()){
      this.initial = 'Updating...';
      this.valueUpdated.emit(this.value);
    }
    this.active = false;
  }
}
