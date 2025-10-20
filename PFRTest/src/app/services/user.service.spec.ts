import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { UserService } from './user.service';
import { User } from '../models/user.model';
import { Post } from '../models/post.model';

describe('UserService', () => {
  let service: UserService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [UserService]
    });
    service = TestBed.inject(UserService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get all users', () => {
    const mockUsers: User[] = [
      {
        id: 1, name: 'Test User', username: 'test', email: 'test@example.com',
        address: { street: '', suite: '', city: '', zipcode: '', geo: { lat: '', lng: '' } },
        phone: '', website: '', company: { name: '', catchPhrase: '', bs: '' }
      }
    ];

    service.getAllUsers().subscribe(users => {
      expect(users.length).toBe(1);
      expect(users).toEqual(mockUsers);
    });

    const req = httpMock.expectOne('https://jsonplaceholder.typicode.com/users');
    expect(req.request.method).toBe('GET');
    req.flush(mockUsers);
  });

  it('should get user posts', () => {
    const mockPosts: Post[] = [
      { userId: 1, id: 1, title: 'Test Post', body: 'Test Body' }
    ];

    service.getUserPosts(1).subscribe(posts => {
      expect(posts.length).toBe(1);
      expect(posts).toEqual(mockPosts);
    });

    const req = httpMock.expectOne('https://jsonplaceholder.typicode.com/users/1/posts');
    expect(req.request.method).toBe('GET');
    req.flush(mockPosts);
  });

  it('should handle error when getting users fails', () => {
    service.getAllUsers().subscribe({
      next: () => fail('should have failed'),
      error: (error) => {
        expect(error).toBeTruthy();
      }
    });

    const req = httpMock.expectOne('https://jsonplaceholder.typicode.com/users');
    req.error(new ProgressEvent('error'));
  });

  it('should update loading state', (done) => {
    const mockUsers: User[] = [];

    service.loading$.subscribe(loading => {
      if (loading === false) {
        done();
      }
    });

    service.getAllUsers().subscribe();

    const req = httpMock.expectOne('https://jsonplaceholder.typicode.com/users');
    req.flush(mockUsers);
  });
});
