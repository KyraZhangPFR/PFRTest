import { Component, OnInit } from '@angular/core';
import {HttpClient} from "@angular/common/http";

@Component({
  selector: 'app-screen',
  templateUrl: './screen.component.html',
  styleUrls: ['./screen.component.css']
})
export class ScreenComponent implements OnInit {
  users: any;
  userPosts: any;
  postSelected: any;
  selectedUser: any;

  constructor(private http : HttpClient,) { }

  ngOnInit(): void {
    // Get all users information
    this.http.get('https://jsonplaceholder.typicode.com/users').subscribe(Response => {
      this.users = Response;
    });
  }
  
  // Function to get all user's posts
  navToUserPost(id) {
    // Find and store the selected user
    this.selectedUser = this.users.find(user => user.id === id);
    // Get user's posts
    this.http.get('https://jsonplaceholder.typicode.com/users/'+ id+ '/posts').subscribe(postResponse => {
      this.userPosts = postResponse;
      this.postSelected = null; // Reset selected post when changing user
    });
  }
  // Get post content by the title selected
  postContent(post){
    this.postSelected = post;
  }
}
