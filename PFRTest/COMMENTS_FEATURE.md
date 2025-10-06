# Comment Section Feature

## Overview
This document describes the implementation of the comment section feature added to the Discussion Group application.

## Feature Description
Users can now view and add comments on individual posts. When a post is selected:
1. Existing comments are fetched from the JSONPlaceholder API
2. Comments are displayed below the post content
3. Users can add new comments using a text input form
4. New comments appear immediately in the comments list

## Implementation Details

### 1. Component Changes (`screen.component.ts`)

#### New Properties
```typescript
comments: any[] = [];      // Stores the list of comments for selected post
newComment: string = '';   // Binds to the textarea for new comments
```

#### New Methods

**`loadComments(postId: number)`**
- Fetches comments for a specific post from the API
- Called automatically when a post is selected
- Uses the endpoint: `https://jsonplaceholder.typicode.com/posts/{postId}/comments`

**`addComment()`**
- Adds a new comment to the comments list
- Validates that the comment is not empty
- Creates a comment object with:
  - `postId`: ID of the current post
  - `id`: Auto-incremented based on current comments length
  - `name`: Default "New Comment"
  - `email`: Default "user@example.com"
  - `body`: User's comment text
- Clears the input field after adding

#### Modified Methods

**`postContent(post: any)`**
- Now calls `loadComments()` to fetch comments when a post is selected

### 2. Template Changes (`screen.component.html`)

Added a new comment section structure:

```html
<div class="comment-section">
  <!-- Section Header -->
  <h3>Comments</h3>
  
  <!-- Add Comment Form -->
  <div class="add-comment">
    <textarea [(ngModel)]="newComment" ...></textarea>
    <button (click)="addComment()" [disabled]="!newComment.trim()">
      Add Comment
    </button>
  </div>
  
  <!-- Comments List -->
  <div class="comments-list">
    <div *ngFor="let comment of comments" class="comment-item">
      <!-- Comment display -->
    </div>
  </div>
</div>
```

### 3. Styling (`screen.component.css`)

Added comprehensive styles:
- **`.comment-section`**: Container styling with light gray background
- **`.comment-input`**: Styled textarea with border and focus states
- **`.submit-comment`**: Button styling matching app theme
- **`.comment-item`**: Card-style display for each comment
- **`.comment-header`**: Displays commenter name and email
- **`.comment-body`**: Shows comment text

Color scheme matches the existing application theme (#62867b, #52998f).

### 4. Module Configuration (`app.module.ts`)

Added `FormsModule` import to enable two-way data binding:
```typescript
import { FormsModule } from '@angular/forms';
```

This is required for the `[(ngModel)]` directive used in the textarea.

## API Integration

The feature uses the JSONPlaceholder API:
- **GET** `/posts/{postId}/comments` - Fetches existing comments
- Returns an array of comment objects with structure:
  ```json
  {
    "postId": 1,
    "id": 1,
    "name": "Comment title",
    "email": "user@example.com",
    "body": "Comment text"
  }
  ```

## User Experience

1. **Select a User**: Choose from the user dropdown
2. **View Posts**: Posts appear in the right sidebar
3. **Select a Post**: Click a post title to see details
4. **View Comments**: Existing comments load automatically
5. **Add Comment**: 
   - Type in the textarea
   - Click "Add Comment" button
   - See your comment appear immediately
   - Input field clears for next comment

## Future Enhancements

Potential improvements could include:
- User authentication for personalized comments
- Edit/delete functionality for comments
- Reply to comments (nested comments)
- Comment voting/reactions
- Persistent storage for new comments
- Loading indicators while fetching comments
- Error handling for API failures
