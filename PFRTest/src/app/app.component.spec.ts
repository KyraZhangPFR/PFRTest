import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { AppComponent } from './app.component';
import { ScreenComponent } from './screen/screen.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

describe('AppComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        HttpClientTestingModule,
        NgbModule
      ],
      declarations: [
        AppComponent,
        ScreenComponent,
        SidebarComponent
      ],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it(`should have as title 'PFRTest'`, () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app.title).toEqual('PFRTest');
  });

  it('should handle posts loaded event', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    const mockPosts = [
      { userId: 1, id: 1, title: 'Test Post', body: 'Test Body' }
    ];

    app.onPostsLoaded(mockPosts);
    expect(app.currentPosts).toEqual(mockPosts);
  });

  it('should handle post selected event', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    const mockPost = { userId: 1, id: 1, title: 'Test Post', body: 'Test Body' };

    app.onPostSelected(mockPost);
    expect(app.selectedPost).toEqual(mockPost);
  });

  it('should handle sidebar post clicked event', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    const mockPost = { userId: 1, id: 1, title: 'Test Post', body: 'Test Body' };

    app.onSidebarPostClicked(mockPost);
    expect(app.selectedPost).toEqual(mockPost);
  });
});
