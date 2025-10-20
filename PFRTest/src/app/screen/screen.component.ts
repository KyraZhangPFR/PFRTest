import { Component, OnInit, Output, EventEmitter, Input, SimpleChanges, OnChanges } from '@angular/core';
import { UserService } from '../services/user.service';
import { User } from '../models/user.model';
import { Post } from '../models/post.model';

@Component({
  selector: 'app-screen',
  templateUrl: './screen.component.html',
  styleUrls: ['./screen.component.css']
})
export class ScreenComponent implements OnInit, OnChanges {
  users: User[] = [];
  userPosts: Post[] = [];
  postSelected: Post | null = null;
  selectedUser: User | null = null;
  loading = false;
  error: string | null = null;

  @Input() selectedPostFromSidebar: Post | null = null;
  @Output() postsLoaded = new EventEmitter<Post[]>();
  @Output() postSelected$ = new EventEmitter<Post | null>();

  constructor(private userService: UserService) { }

  ngOnInit(): void {
    this.loadUsers();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.selectedPostFromSidebar && this.selectedPostFromSidebar) {
      this.postSelected = this.selectedPostFromSidebar;
    }
  }

  private loadUsers(): void {
    this.userService.loading$.subscribe(loading => this.loading = loading);
    this.userService.error$.subscribe(error => this.error = error);

    this.userService.getAllUsers().subscribe({
      next: (users) => {
        this.users = users;
      },
      error: (error) => {
        console.error('Error loading users:', error);
      }
    });
  }

  navToUserPost(id: number): void {
    this.selectedUser = this.users.find(user => user.id === id) || null;

    this.userService.getUserPosts(id).subscribe({
      next: (posts) => {
        this.userPosts = posts;
        this.postSelected = null;
        this.postsLoaded.emit(posts);
        this.postSelected$.emit(null);
      },
      error: (error) => {
        console.error('Error loading posts:', error);
      }
    });
  }
}
