import { Component, Input, Output, EventEmitter, HostListener, ViewChild, ElementRef } from '@angular/core';

@Component({
  selector: 'app-form-field',
  templateUrl: './form-field.component.html',
  styleUrl: './form-field.component.css'
})
export class FormFieldComponent {
  @ViewChild('inputField') inputField!: ElementRef;
  @Input({required: true}) enable!: boolean;
  @Input({required: true}) initial!: string|null;
  @Input() maxLength?: number;
  @Output() valueUpdated = new EventEmitter<string>();
  active: boolean = false;
  value: string = '';

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

