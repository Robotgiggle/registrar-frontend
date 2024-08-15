import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SheetUploadComponent } from './sheet-upload.component';

describe('SheetUploadComponent', () => {
  let component: SheetUploadComponent;
  let fixture: ComponentFixture<SheetUploadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SheetUploadComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SheetUploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
