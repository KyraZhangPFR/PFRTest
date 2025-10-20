import { Component } from '@angular/core';
import { Post } from './models/post.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'PFRTest';
  currentPosts: Post[] = [];
  selectedPost: Post | null = null;

  onPostsLoaded(posts: Post[]): void {
    this.currentPosts = posts;
  }

  onPostSelected(post: Post | null): void {
    this.selectedPost = post;
  }

  onSidebarPostClicked(post: Post): void {
    this.selectedPost = post;
  }
}
