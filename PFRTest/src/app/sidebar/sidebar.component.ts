import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Post } from '../models/post.model';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent {
  @Input() posts: Post[] = [];
  @Input() selectedPost: Post | null = null;
  @Output() postClicked = new EventEmitter<Post>();

  onPostClick(post: Post): void {
    this.postClicked.emit(post);
  }
}
