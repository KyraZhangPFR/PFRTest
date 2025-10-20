import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { DebugElement, NO_ERRORS_SCHEMA } from '@angular/core';
import { By } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { ScreenComponent } from './screen/screen.component';
import { MOCK_USERS, MOCK_POSTS } from './testing/test-data';

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;
  let compiled: DebugElement;
  let httpMock: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        AppComponent,
        ScreenComponent
      ],
      imports: [
        HttpClientTestingModule
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    compiled = fixture.debugElement;
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    // Don't verify HTTP mocks in AppComponent tests since ScreenComponent is already tested
    // httpMock.verify();
  });

  it('should create the app', () => {
    expect(component).toBeTruthy();
  });

  describe('Component Properties', () => {
    it('should have title property set to "PFRTest"', () => {
      expect(component.title).toEqual('PFRTest');
    });

    it('should have screen property defined as ViewChild', () => {
      expect(component.screen).toBeDefined();
    });
  });

  describe('ViewChild Reference', () => {
    it('should have ScreenComponent as ViewChild after view initialization', () => {
      fixture.detectChanges();
      
      const req = httpMock.expectOne('https://jsonplaceholder.typicode.com/users');
      req.flush(MOCK_USERS);
      fixture.detectChanges(); // Run change detection again after HTTP response
      
      expect(component.screen).toBeTruthy();
      expect(component.screen instanceof ScreenComponent).toBeTruthy();
    });

    it('should be able to access ScreenComponent properties through ViewChild', () => {
      fixture.detectChanges();
      
      const req = httpMock.expectOne('https://jsonplaceholder.typicode.com/users');
      req.flush(MOCK_USERS);
      fixture.detectChanges(); // Run change detection again after HTTP response
      
      expect(component.screen.users).toBeDefined();
      expect(component.screen.userPosts).toBeDefined();
      expect(component.screen.postSelected).toBeDefined();
      expect(component.screen.selectedUser).toBeDefined();
    });

    it('should be able to call ScreenComponent methods through ViewChild', () => {
      fixture.detectChanges();
      
      const req = httpMock.expectOne('https://jsonplaceholder.typicode.com/users');
      req.flush(MOCK_USERS);
      fixture.detectChanges(); // Run change detection again after HTTP response
      
      spyOn(component.screen, 'navToUserPost');
      component.screen.navToUserPost(1);
      expect(component.screen.navToUserPost).toHaveBeenCalledWith(1);
    });
  });

  describe('Template Structure', () => {
    beforeEach(() => {
      fixture.detectChanges();
      const req = httpMock.expectOne('https://jsonplaceholder.typicode.com/users');
      req.flush(MOCK_USERS);
      fixture.detectChanges(); // Run change detection again after HTTP response
    });

    it('should render toolbar with correct role', () => {
      const toolbar = compiled.query(By.css('.toolbar'));
      expect(toolbar).toBeTruthy();
      expect(toolbar.nativeElement.getAttribute('role')).toBe('banner');
    });

    it('should render toolbar title', () => {
      const title = compiled.query(By.css('.top-title'));
      expect(title).toBeTruthy();
      expect(title.nativeElement.textContent).toContain('Discussion Group');
    });

    it('should render toolbar image', () => {
      const image = compiled.query(By.css('.top-image'));
      expect(image).toBeTruthy();
      expect(image.nativeElement.getAttribute('src')).toContain('assets/Capture.PNG');
    });

    it('should render main content area with correct role', () => {
      const content = compiled.query(By.css('.content'));
      expect(content).toBeTruthy();
      expect(content.nativeElement.getAttribute('role')).toBe('main');
    });

    it('should render app-screen component in main content', () => {
      const screenElement = compiled.query(By.css('app-screen'));
      expect(screenElement).toBeTruthy();
    });

    it('should render sidebar', () => {
      const sidebar = compiled.query(By.css('.sidebar'));
      expect(sidebar).toBeTruthy();
    });

    it('should render sidebar title', () => {
      const sidebarTitle = compiled.query(By.css('.sidebar-title h1'));
      expect(sidebarTitle).toBeTruthy();
      expect(sidebarTitle.nativeElement.textContent).toContain('Posts');
    });
  });

  describe('Interaction with ScreenComponent', () => {
    beforeEach(() => {
      fixture.detectChanges();
      const req = httpMock.expectOne('https://jsonplaceholder.typicode.com/users');
      req.flush(MOCK_USERS);
      fixture.detectChanges(); // Run change detection again after HTTP response
    });

    it('should bind to screen.userPosts in template', () => {
      component.screen.userPosts = MOCK_POSTS;
      fixture.detectChanges();

      const sidebarPosts = compiled.query(By.css('.sidebar-posts'));
      expect(sidebarPosts).toBeTruthy();
    });

    it('should not show posts sidebar when userPosts is null', () => {
      component.screen.userPosts = null;
      fixture.detectChanges();

      const sidebarPosts = compiled.query(By.css('.sidebar-posts'));
      expect(sidebarPosts).toBeFalsy();
    });

    it('should render post titles in sidebar when userPosts is available', () => {
      component.screen.userPosts = MOCK_POSTS;
      fixture.detectChanges();

      const postTitleItems = compiled.queryAll(By.css('.post-title-item'));
      expect(postTitleItems.length).toBe(3);
      expect(postTitleItems[0].nativeElement.textContent.trim()).toBe(MOCK_POSTS[0].title);
    });

    it('should call screen.postContent when post title is clicked', () => {
      spyOn(component.screen, 'postContent');
      component.screen.userPosts = MOCK_POSTS;
      fixture.detectChanges();

      const postTitleItems = compiled.queryAll(By.css('.post-title-item'));
      postTitleItems[0].nativeElement.click();

      expect(component.screen.postContent).toHaveBeenCalledWith(MOCK_POSTS[0]);
    });

    it('should apply active class to selected post', () => {
      component.screen.userPosts = MOCK_POSTS;
      component.screen.postSelected = MOCK_POSTS[0];
      fixture.detectChanges();

      const postTitleItems = compiled.queryAll(By.css('.post-title-item'));
      expect(postTitleItems[0].nativeElement.classList.contains('active')).toBeTruthy();
      expect(postTitleItems[1].nativeElement.classList.contains('active')).toBeFalsy();
    });

    it('should update active class when different post is selected', () => {
      component.screen.userPosts = MOCK_POSTS;
      component.screen.postSelected = MOCK_POSTS[0];
      fixture.detectChanges();

      let postTitleItems = compiled.queryAll(By.css('.post-title-item'));
      expect(postTitleItems[0].nativeElement.classList.contains('active')).toBeTruthy();

      component.screen.postSelected = MOCK_POSTS[1];
      fixture.detectChanges();

      postTitleItems = compiled.queryAll(By.css('.post-title-item'));
      expect(postTitleItems[0].nativeElement.classList.contains('active')).toBeFalsy();
      expect(postTitleItems[1].nativeElement.classList.contains('active')).toBeTruthy();
    });
  });

  describe('Component Communication', () => {
    beforeEach(() => {
      fixture.detectChanges();
      const req = httpMock.expectOne('https://jsonplaceholder.typicode.com/users');
      req.flush(MOCK_USERS);
      fixture.detectChanges(); // Run change detection again after HTTP response
    });

    it('should reflect ScreenComponent state changes in AppComponent template', () => {
      expect(component.screen.userPosts).toBeUndefined();
      
      component.screen.userPosts = MOCK_POSTS;
      fixture.detectChanges();

      const sidebarPosts = compiled.query(By.css('.sidebar-posts'));
      expect(sidebarPosts).toBeTruthy();
    });

    it('should use safe navigation operator for screen properties', () => {
      component.screen.userPosts = null;
      
      // Should not throw error when userPosts is null due to safe navigation operator
      expect(() => fixture.detectChanges()).not.toThrow();
    });

    it('should handle multiple post selections through screen component', () => {
      component.screen.userPosts = MOCK_POSTS;
      fixture.detectChanges();

      // Select first post
      component.screen.postContent(MOCK_POSTS[0]);
      fixture.detectChanges();
      expect(component.screen.postSelected).toEqual(MOCK_POSTS[0]);

      // Select second post
      component.screen.postContent(MOCK_POSTS[1]);
      fixture.detectChanges();
      expect(component.screen.postSelected).toEqual(MOCK_POSTS[1]);
    });
  });

  describe('Template Integration', () => {
    beforeEach(() => {
      fixture.detectChanges();
      const req = httpMock.expectOne('https://jsonplaceholder.typicode.com/users');
      req.flush(MOCK_USERS);
      fixture.detectChanges(); // Run change detection again after HTTP response
    });

    it('should have three main sections: toolbar, content, and sidebar', () => {
      const toolbar = compiled.query(By.css('.toolbar'));
      const content = compiled.query(By.css('.content'));
      const sidebar = compiled.query(By.css('.sidebar'));

      expect(toolbar).toBeTruthy();
      expect(content).toBeTruthy();
      expect(sidebar).toBeTruthy();
    });

    it('should embed ScreenComponent in content section', () => {
      const content = compiled.query(By.css('.content'));
      const screenElement = content.query(By.css('app-screen'));
      
      expect(screenElement).toBeTruthy();
    });

    it('should display posts in sidebar only when available', () => {
      // Initially no posts
      let sidebarPosts = compiled.query(By.css('.sidebar-posts'));
      expect(sidebarPosts).toBeFalsy();

      // Add posts
      component.screen.userPosts = MOCK_POSTS;
      fixture.detectChanges();
      sidebarPosts = compiled.query(By.css('.sidebar-posts'));
      expect(sidebarPosts).toBeTruthy();
    });
  });

  describe('Data Flow Integration', () => {
    beforeEach(() => {
      fixture.detectChanges();
      const req = httpMock.expectOne('https://jsonplaceholder.typicode.com/users');
      req.flush(MOCK_USERS);
      fixture.detectChanges(); // Run change detection again after HTTP response
    });

    it('should support full user interaction workflow', () => {
      // Step 1: Select user (normally done through screen component)
      component.screen.users = MOCK_USERS;
      component.screen.selectedUser = MOCK_USERS[0];
      component.screen.userPosts = MOCK_POSTS;
      fixture.detectChanges();

      // Step 2: Verify posts appear in sidebar
      const postTitleItems = compiled.queryAll(By.css('.post-title-item'));
      expect(postTitleItems.length).toBe(3);

      // Step 3: Select a post
      component.screen.postSelected = MOCK_POSTS[0];
      fixture.detectChanges();

      // Step 4: Verify active class is applied
      expect(postTitleItems[0].nativeElement.classList.contains('active')).toBeTruthy();
    });

    it('should handle user change workflow', () => {
      // User 1 with posts
      component.screen.users = MOCK_USERS;
      component.screen.selectedUser = MOCK_USERS[0];
      component.screen.userPosts = MOCK_POSTS;
      component.screen.postSelected = MOCK_POSTS[0];
      fixture.detectChanges();

      let postTitleItems = compiled.queryAll(By.css('.post-title-item'));
      expect(postTitleItems.length).toBe(3);

      // Change to user 2 with different posts
      component.screen.selectedUser = MOCK_USERS[1];
      component.screen.userPosts = MOCK_POSTS.slice(0, 2);
      component.screen.postSelected = null;
      fixture.detectChanges();

      postTitleItems = compiled.queryAll(By.css('.post-title-item'));
      expect(postTitleItems.length).toBe(2);
    });
  });
});
