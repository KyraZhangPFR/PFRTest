import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';

import { ScreenComponent } from './screen.component';
import { MOCK_USERS, MOCK_POSTS, MOCK_USER_2_POSTS } from '../testing/test-data';

describe('ScreenComponent', () => {
  let component: ScreenComponent;
  let fixture: ComponentFixture<ScreenComponent>;
  let httpMock: HttpTestingController;
  let compiled: DebugElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ScreenComponent ],
      imports: [ HttpClientTestingModule ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ScreenComponent);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);
    compiled = fixture.debugElement;
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Component Initialization', () => {
    it('should initialize with undefined properties', () => {
      expect(component.users).toBeUndefined();
      expect(component.userPosts).toBeUndefined();
      expect(component.postSelected).toBeUndefined();
      expect(component.selectedUser).toBeUndefined();
    });

    it('should have HttpClient injected', () => {
      expect(component['http']).toBeDefined();
    });
  });

  describe('ngOnInit', () => {
    it('should fetch users from API on initialization', () => {
      fixture.detectChanges();

      const req = httpMock.expectOne('https://jsonplaceholder.typicode.com/users');
      expect(req.request.method).toBe('GET');
      req.flush(MOCK_USERS);

      expect(component.users).toEqual(MOCK_USERS);
      expect(component.users.length).toBe(3);
    });

    it('should populate users array with correct data structure', () => {
      fixture.detectChanges();

      const req = httpMock.expectOne('https://jsonplaceholder.typicode.com/users');
      req.flush(MOCK_USERS);

      expect(component.users[0]).toEqual(jasmine.objectContaining({
        id: jasmine.any(Number),
        name: jasmine.any(String),
        email: jasmine.any(String)
      }));
    });
  });

  describe('navToUserPost', () => {
    beforeEach(() => {
      fixture.detectChanges();
      const usersReq = httpMock.expectOne('https://jsonplaceholder.typicode.com/users');
      usersReq.flush(MOCK_USERS);
    });

    it('should set selectedUser when user is selected', () => {
      component.navToUserPost(1);

      const postsReq = httpMock.expectOne('https://jsonplaceholder.typicode.com/users/1/posts');
      postsReq.flush(MOCK_POSTS);

      expect(component.selectedUser).toEqual(MOCK_USERS[0]);
      expect(component.selectedUser.id).toBe(1);
      expect(component.selectedUser.name).toBe('Leanne Graham');
    });

    it('should fetch user posts from API', () => {
      component.navToUserPost(1);

      const req = httpMock.expectOne('https://jsonplaceholder.typicode.com/users/1/posts');
      expect(req.request.method).toBe('GET');
      req.flush(MOCK_POSTS);

      expect(component.userPosts).toEqual(MOCK_POSTS);
      expect(component.userPosts.length).toBe(3);
    });

    it('should reset postSelected when changing users', () => {
      component.postSelected = MOCK_POSTS[0];

      component.navToUserPost(2);

      const req = httpMock.expectOne('https://jsonplaceholder.typicode.com/users/2/posts');
      req.flush(MOCK_USER_2_POSTS);

      expect(component.postSelected).toBeNull();
    });

    it('should handle different user IDs correctly', () => {
      component.navToUserPost(2);

      const req = httpMock.expectOne('https://jsonplaceholder.typicode.com/users/2/posts');
      req.flush(MOCK_USER_2_POSTS);

      expect(component.selectedUser).toEqual(MOCK_USERS[1]);
      expect(component.selectedUser.id).toBe(2);
      expect(component.userPosts).toEqual(MOCK_USER_2_POSTS);
    });

    it('should find correct user from users array', () => {
      component.navToUserPost(3);

      const req = httpMock.expectOne('https://jsonplaceholder.typicode.com/users/3/posts');
      req.flush([]);

      expect(component.selectedUser).toEqual(MOCK_USERS[2]);
      expect(component.selectedUser.name).toBe('Clementine Bauch');
    });
  });

  describe('postContent', () => {
    it('should set postSelected when post is clicked', () => {
      const post = MOCK_POSTS[0];
      component.postContent(post);

      expect(component.postSelected).toEqual(post);
    });

    it('should update postSelected with different posts', () => {
      component.postContent(MOCK_POSTS[0]);
      expect(component.postSelected).toEqual(MOCK_POSTS[0]);

      component.postContent(MOCK_POSTS[1]);
      expect(component.postSelected).toEqual(MOCK_POSTS[1]);
    });

    it('should handle post with complete data structure', () => {
      const post = MOCK_POSTS[0];
      component.postContent(post);

      expect(component.postSelected).toEqual(jasmine.objectContaining({
        userId: jasmine.any(Number),
        id: jasmine.any(Number),
        title: jasmine.any(String),
        body: jasmine.any(String)
      }));
    });
  });

  describe('Template Rendering', () => {
    beforeEach(() => {
      fixture.detectChanges();
      const usersReq = httpMock.expectOne('https://jsonplaceholder.typicode.com/users');
      usersReq.flush(MOCK_USERS);
      fixture.detectChanges();
    });

    it('should render user dropdown button', () => {
      const dropdownButton = compiled.query(By.css('#users'));
      expect(dropdownButton).toBeTruthy();
    });

    it('should display "Select a User" when no user is selected', () => {
      const dropdownButton = compiled.query(By.css('#users'));
      expect(dropdownButton.nativeElement.textContent.trim()).toContain('Select a User');
    });

    it('should display selected user name in dropdown', () => {
      component.selectedUser = MOCK_USERS[0];
      fixture.detectChanges();

      const dropdownButton = compiled.query(By.css('#users'));
      expect(dropdownButton.nativeElement.textContent.trim()).toContain('Leanne Graham');
    });

    it('should render dropdown menu items for all users', () => {
      const dropdownItems = compiled.queryAll(By.css('[ngbDropdownItem]'));
      expect(dropdownItems.length).toBe(3);
    });

    it('should display post details when post is selected', () => {
      component.postSelected = MOCK_POSTS[0];
      fixture.detectChanges();

      const postContent = compiled.query(By.css('.post-content'));
      expect(postContent).toBeTruthy();
      expect(postContent.nativeElement.textContent).toContain(MOCK_POSTS[0].body);
    });

    it('should not display post details when no post is selected', () => {
      component.postSelected = null;
      fixture.detectChanges();

      const postContent = compiled.query(By.css('.post-content'));
      expect(postContent).toBeFalsy();
    });
  });

  describe('User Interaction', () => {
    beforeEach(() => {
      fixture.detectChanges();
      const usersReq = httpMock.expectOne('https://jsonplaceholder.typicode.com/users');
      usersReq.flush(MOCK_USERS);
      fixture.detectChanges();
    });

    it('should call navToUserPost when dropdown item is clicked', () => {
      spyOn(component, 'navToUserPost');
      
      const dropdownItems = compiled.queryAll(By.css('[ngbDropdownItem]'));
      dropdownItems[0].nativeElement.click();

      expect(component.navToUserPost).toHaveBeenCalledWith(1);
    });
  });

  describe('Component State Changes', () => {
    beforeEach(() => {
      fixture.detectChanges();
      const usersReq = httpMock.expectOne('https://jsonplaceholder.typicode.com/users');
      usersReq.flush(MOCK_USERS);
    });

    it('should maintain state across multiple user selections', () => {
      // Select first user
      component.navToUserPost(1);
      let req = httpMock.expectOne('https://jsonplaceholder.typicode.com/users/1/posts');
      req.flush(MOCK_POSTS);

      expect(component.selectedUser.id).toBe(1);
      expect(component.userPosts.length).toBe(3);

      // Select second user
      component.navToUserPost(2);
      req = httpMock.expectOne('https://jsonplaceholder.typicode.com/users/2/posts');
      req.flush(MOCK_USER_2_POSTS);

      expect(component.selectedUser.id).toBe(2);
      expect(component.userPosts.length).toBe(2);
      expect(component.postSelected).toBeNull();
    });

    it('should update state when selecting and changing posts', () => {
      component.navToUserPost(1);
      const req = httpMock.expectOne('https://jsonplaceholder.typicode.com/users/1/posts');
      req.flush(MOCK_POSTS);

      component.postContent(MOCK_POSTS[0]);
      expect(component.postSelected.id).toBe(1);

      component.postContent(MOCK_POSTS[1]);
      expect(component.postSelected.id).toBe(2);
    });
  });

  describe('Data Flow', () => {
    it('should follow correct data flow: users -> select user -> posts -> select post', () => {
      // Step 1: Load users
      fixture.detectChanges();
      const usersReq = httpMock.expectOne('https://jsonplaceholder.typicode.com/users');
      usersReq.flush(MOCK_USERS);
      expect(component.users).toBeDefined();

      // Step 2: Select user
      component.navToUserPost(1);
      const postsReq = httpMock.expectOne('https://jsonplaceholder.typicode.com/users/1/posts');
      expect(component.selectedUser).toBeDefined();

      // Step 3: Load posts
      postsReq.flush(MOCK_POSTS);
      expect(component.userPosts).toBeDefined();

      // Step 4: Select post
      component.postContent(MOCK_POSTS[0]);
      expect(component.postSelected).toBeDefined();
    });
  });
});
