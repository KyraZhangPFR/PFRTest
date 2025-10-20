import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ScreenComponent } from './screen.component';
import { UserService } from '../services/user.service';
import { of } from 'rxjs';

describe('ScreenComponent', () => {
  let component: ScreenComponent;
  let fixture: ComponentFixture<ScreenComponent>;
  let userService: jasmine.SpyObj<UserService>;

  beforeEach(async () => {
    const userServiceSpy = jasmine.createSpyObj('UserService', ['getAllUsers', 'getUserPosts'], {
      loading$: of(false),
      error$: of(null)
    });

    await TestBed.configureTestingModule({
      declarations: [ ScreenComponent ],
      imports: [ HttpClientTestingModule, NgbModule ],
      providers: [
        { provide: UserService, useValue: userServiceSpy }
      ]
    })
    .compileComponents();

    userService = TestBed.inject(UserService) as jasmine.SpyObj<UserService>;
  });

  beforeEach(() => {
    userService.getAllUsers.and.returnValue(of([]));
    fixture = TestBed.createComponent(ScreenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load users on init', () => {
    expect(userService.getAllUsers).toHaveBeenCalled();
  });

  it('should load user posts when navToUserPost is called', () => {
    const mockPosts = [
      { userId: 1, id: 1, title: 'Test Post', body: 'Test Body' }
    ];
    userService.getUserPosts.and.returnValue(of(mockPosts));
    component.users = [
      { id: 1, name: 'Test User', username: 'test', email: 'test@example.com',
        address: { street: '', suite: '', city: '', zipcode: '', geo: { lat: '', lng: '' } },
        phone: '', website: '', company: { name: '', catchPhrase: '', bs: '' } }
    ];

    component.navToUserPost(1);

    expect(userService.getUserPosts).toHaveBeenCalledWith(1);
  });

  it('should emit postsLoaded event when posts are loaded', (done) => {
    const mockPosts = [
      { userId: 1, id: 1, title: 'Test Post', body: 'Test Body' }
    ];
    userService.getUserPosts.and.returnValue(of(mockPosts));
    component.users = [
      { id: 1, name: 'Test User', username: 'test', email: 'test@example.com',
        address: { street: '', suite: '', city: '', zipcode: '', geo: { lat: '', lng: '' } },
        phone: '', website: '', company: { name: '', catchPhrase: '', bs: '' } }
    ];

    component.postsLoaded.subscribe((posts) => {
      expect(posts).toEqual(mockPosts);
      done();
    });

    component.navToUserPost(1);
  });
});
