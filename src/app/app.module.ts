import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HttpClientXsrfModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';

import { DatePipe } from '@angular/common';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { StudentListComponent } from './student-list/student-list.component';
import { StudentProfileComponent } from './student-profile/student-profile.component';
import { SearchComponent } from './search/search.component';
import { BatchProcessComponent } from './batch-process/batch-process.component';
import { SheetUploadComponent } from './sheet-upload/sheet-upload.component';
import { FormFieldComponent } from './form-field/form-field.component';
import { FormDropdownComponent } from './form-dropdown/form-dropdown.component';
import { FormDateComponent } from './form-date/form-date.component';
import { CommentComponent } from './comment/comment.component';

@NgModule({
  declarations: [
    AppComponent,
    StudentListComponent,
    StudentProfileComponent,
    SearchComponent,
    BatchProcessComponent,
    SheetUploadComponent,
    FormFieldComponent,
    FormDropdownComponent,
    FormDateComponent,
    CommentComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    HttpClientXsrfModule.withOptions({
      cookieName: 'csrftoken',
      headerName: 'X-CSRFToken'
    }),
    FormsModule,
    AppRoutingModule,
  ],
  providers: [
    DatePipe,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
