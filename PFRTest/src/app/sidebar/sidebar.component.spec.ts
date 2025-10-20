import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SidebarComponent } from './sidebar.component';

describe('SidebarComponent', () => {
  let component: SidebarComponent;
  let fixture: ComponentFixture<SidebarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SidebarComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SidebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit postClicked event when onPostClick is called', (done) => {
    const mockPost = { userId: 1, id: 1, title: 'Test Post', body: 'Test Body' };

    component.postClicked.subscribe((post) => {
      expect(post).toEqual(mockPost);
      done();
    });

    component.onPostClick(mockPost);
  });

  it('should display posts when provided', () => {
    const mockPosts = [
      { userId: 1, id: 1, title: 'Test Post 1', body: 'Test Body 1' },
      { userId: 1, id: 2, title: 'Test Post 2', body: 'Test Body 2' }
    ];
    component.posts = mockPosts;
    fixture.detectChanges();

    const compiled = fixture.nativeElement;
    const postItems = compiled.querySelectorAll('.post-title-item');
    expect(postItems.length).toBe(2);
  });
});
