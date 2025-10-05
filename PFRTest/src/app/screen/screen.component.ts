import { Component, OnInit } from '@angular/core';
import {HttpClient} from '@angular/common/http';

@Component({
  selector: 'app-screen',
  templateUrl: './screen.component.html',
  styleUrls: ['./screen.component.css']
})
export class ScreenComponent implements OnInit {
  users: any;
  userPosts: any;
  postSelected: any;
  postComments: any;
  newComment = '';

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    // Get all users information
    this.http.get('https://jsonplaceholder.typicode.com/users').subscribe(Response => {
    this.users = Response;
  });
  }
  // Function to get all user's posts
  navToUserPost(id): void {
    this.http.get('https://jsonplaceholder.typicode.com/users/' + id + '/posts').subscribe(postResponse => {
      this.userPosts = postResponse;
    });
  }
  // Get post content by the title selected
  postContent(post): void {
    this.postSelected = post;
    this.loadComments(post.id);
  }

  // Load comments for the selected post
  loadComments(postId): void {
    this.http.get('https://jsonplaceholder.typicode.com/posts/' + postId + '/comments').subscribe(commentsResponse => {
      this.postComments = commentsResponse;
    });
  }

  // Add a new comment to the list
  addComment(): void {
    if (this.newComment.trim()) {
      const comment = {
        postId: this.postSelected.id,
        id: this.postComments ? this.postComments.length + 1 : 1,
        name: 'New User',
        email: 'user@example.com',
        body: this.newComment
      };
      if (!this.postComments) {
        this.postComments = [];
      }
      this.postComments.push(comment);
      this.newComment = '';
    }
  }
}
