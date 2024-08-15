import { Component, Input } from '@angular/core';
import { StudentComment } from '../response-structs';

@Component({
  selector: 'app-comment',
  templateUrl: './comment.component.html',
  styleUrl: './comment.component.css'
})
export class CommentComponent {
  @Input({required: true}) commentObj!: StudentComment;
  expanded: boolean = false;
}
