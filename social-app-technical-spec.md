# Social Media PWA - Complete Technical Specification

## Project Overview
A Progressive Web App for connecting with close friends through time-limited, weekly content sharing. Maximum 15 friends, focused on authentic moments with automatic content expiration.

---

## CORE FEATURES & BUSINESS LOGIC

### 1. Content Posting Schedule
- **Wednesday Videos**: Users can record/upload ONE 2-minute video every Wednesday
  - Recording window: Wednesday 12:00 AM - 11:59 PM (user's local timezone)
  - Maximum duration: 2 minutes (120 seconds)
  - Video must be recorded through in-app camera (not gallery uploads for Wednesday)
  - Only one video per Wednesday allowed
  
- **Sunday Dumps**: Users can upload multiple photos/videos every Sunday
  - Upload window: Sunday 12:00 AM - 11:59 PM (user's local timezone)
  - maximum 10 items in dump
  - Can mix photos and videos
  - Videos can be any length up to 2 minutes each
  - Can upload from gallery or camera

### 2. Content Expiration
- All content (Wednesday videos + Sunday dumps) expires **48 hours after posting**
- Only the uploading user can view expired content, the user's friends cannot access it after 48h

### 3. Feed Requirements
- Chronological feed showing latest posts from friends
- Maximum 15 friends total (hard cap, enforced at database level)
- Show active posts only (not expired)
- Each post displays:
  - User's name and profile picture
  - Post type indicator (Wednesday Video / Sunday Dump)
  - Time posted 
  - Content (video player or photo grid)
  - Song of the week on Sunday (if added)
  - Weekly prompt response on Sunday (if added)

### 4. Weekly Prompt System
- Admin (you) can set a weekly prompt question
- Prompts change every week (e.g., "What made you smile this week?")
- Users can optionally respond to the prompt when posting
- Prompt responses display with the post
- Database should store prompt history

### 5. Song of the Week
- Users can select one song per week via Spotify or Apple Music
- Song displays on their posts for that week
- Show: Album art, song title, artist name
- Playable 30-second preview if available
- Song selection is optional

### 6. Friend System
- Users can send friend requests
- Must be mutually accepted (no one-way following)
- Hard limit: 15 friends maximum per user
- Friend list management (remove friends)
- Pending requests view

---

## TECHNICAL ARCHITECTURE

### Technology Stack

**Backend:**
- **Framework**: FastAPI (Python 3.11+)
- **Database**: PostgreSQL 15+
- **ORM**: SQLAlchemy
- **Authentication**: JWT tokens with refresh token rotation
- **File Storage**: AWS S3 or Cloudflare R2
- **Task Queue**: Celery with Redis (for scheduled content deletion)
- **API Documentation**: Auto-generated with FastAPI/Swagger

**Frontend:**
- **Framework**: React 18+ with TypeScript
- **State Management**: React Context API + React Query for server state
- **Routing**: React Router v6
- **Styling**: Tailwind CSS
- **PWA Features**: Workbox for service worker
- **Video Recording**: MediaRecorder API
- **HTTP Client**: Axios
- **UI Components**: Headless UI or shadcn/ui

**DevOps:**
- **Backend Hosting**: Railway, Render, or DigitalOcean
- **Frontend Hosting**: Vercel or Netlify
- **CDN**: Cloudflare (free tier)
- **Domain**: Custom domain with SSL

---

## DATABASE SCHEMA

### Users Table
```sql
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    username VARCHAR(50) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(100),
    profile_picture_url TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP,
    is_active BOOLEAN DEFAULT TRUE,
    timezone VARCHAR(50) DEFAULT 'UTC'
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_username ON users(username);
```

### Friendships Table
```sql
CREATE TABLE friendships (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    friend_id UUID REFERENCES users(id) ON DELETE CASCADE,
    status VARCHAR(20) CHECK (status IN ('pending', 'accepted', 'rejected')),
    requested_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    accepted_at TIMESTAMP,
    UNIQUE(user_id, friend_id)
);

CREATE INDEX idx_friendships_user ON friendships(user_id);
CREATE INDEX idx_friendships_status ON friendships(status);

-- Trigger to enforce 15 friend limit
CREATE OR REPLACE FUNCTION check_friend_limit()
RETURNS TRIGGER AS $$
BEGIN
    IF (SELECT COUNT(*) FROM friendships 
        WHERE (user_id = NEW.user_id OR user_id = NEW.friend_id) 
        AND status = 'accepted') >= 15 THEN
        RAISE EXCEPTION 'Friend limit of 15 reached';
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER enforce_friend_limit
BEFORE INSERT OR UPDATE ON friendships
FOR EACH ROW EXECUTE FUNCTION check_friend_limit();
```

### Posts Table
```sql
CREATE TABLE posts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    post_type VARCHAR(20) CHECK (post_type IN ('wednesday_video', 'sunday_dump')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP NOT NULL,
    prompt_response TEXT,
    song_spotify_id VARCHAR(100),
    song_apple_music_id VARCHAR(100),
    song_title VARCHAR(200),
    song_artist VARCHAR(200),
    song_album_art_url TEXT,
    song_preview_url TEXT,
    is_expired BOOLEAN DEFAULT FALSE
);

CREATE INDEX idx_posts_user ON posts(user_id);
CREATE INDEX idx_posts_created ON posts(created_at DESC);
CREATE INDEX idx_posts_expires ON posts(expires_at);
CREATE INDEX idx_posts_type ON posts(post_type);

-- Trigger to prevent multiple Wednesday videos same day
CREATE OR REPLACE FUNCTION check_wednesday_limit()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.post_type = 'wednesday_video' AND EXISTS (
        SELECT 1 FROM posts 
        WHERE user_id = NEW.user_id 
        AND post_type = 'wednesday_video'
        AND DATE(created_at) = DATE(NEW.created_at)
    ) THEN
        RAISE EXCEPTION 'Only one Wednesday video allowed per day';
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER enforce_wednesday_limit
BEFORE INSERT ON posts
FOR EACH ROW EXECUTE FUNCTION check_wednesday_limit();
```

### Media Table
```sql
CREATE TABLE media (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    post_id UUID REFERENCES posts(id) ON DELETE CASCADE,
    media_type VARCHAR(20) CHECK (media_type IN ('video', 'photo')),
    file_url TEXT NOT NULL,
    thumbnail_url TEXT,
    duration_seconds INTEGER,
    file_size_bytes BIGINT,
    upload_order INTEGER, -- for Sunday dumps to maintain order
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_media_post ON media(post_id);
```

### Weekly Prompts Table
```sql
CREATE TABLE weekly_prompts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    prompt_text TEXT NOT NULL,
    week_start_date DATE NOT NULL UNIQUE,
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_active BOOLEAN DEFAULT TRUE
);

CREATE INDEX idx_prompts_date ON weekly_prompts(week_start_date DESC);
```

### Refresh Tokens Table
```sql
CREATE TABLE refresh_tokens (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    token_hash VARCHAR(255) NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_revoked BOOLEAN DEFAULT FALSE
);

CREATE INDEX idx_refresh_tokens_user ON refresh_tokens(user_id);
```

---

## BACKEND API ENDPOINTS

### Authentication Endpoints

**POST /api/auth/register**
- Request body: `{ email, username, password, full_name }`
- Returns: `{ user, access_token, refresh_token }`
- Validation: Email format, password strength (min 8 chars), unique email/username

**POST /api/auth/login**
- Request body: `{ email, password }`
- Returns: `{ user, access_token, refresh_token }`
- Sets httpOnly cookie with refresh token

**POST /api/auth/refresh**
- Request body: `{ refresh_token }`
- Returns: `{ access_token, refresh_token }`
- Rotates refresh token

**POST /api/auth/logout**
- Headers: Authorization Bearer token
- Revokes refresh token
- Returns: `{ message: "Logged out successfully" }`

### User Endpoints

**GET /api/users/me**
- Headers: Authorization Bearer token
- Returns: Current user profile with friend count

**PATCH /api/users/me**
- Headers: Authorization Bearer token
- Request body: `{ full_name?, profile_picture?, timezone? }`
- Returns: Updated user object

**POST /api/users/me/profile-picture**
- Headers: Authorization Bearer token
- Request: multipart/form-data with image file
- Uploads to S3/R2
- Returns: `{ profile_picture_url }`

**GET /api/users/search?q={query}**
- Headers: Authorization Bearer token
- Search users by username or email
- Returns: Array of user objects (exclude already-friends)

### Friends Endpoints

**GET /api/friends**
- Headers: Authorization Bearer token
- Returns: List of accepted friends with profile info

**GET /api/friends/requests**
- Headers: Authorization Bearer token
- Returns: Pending friend requests (sent and received)

**POST /api/friends/request**
- Headers: Authorization Bearer token
- Request body: `{ friend_id }`
- Validates: Not already friends, under 15 friend limit
- Returns: Created friendship object

**POST /api/friends/accept/{friendship_id}**
- Headers: Authorization Bearer token
- Validates: User is the recipient, friendship is pending
- Returns: Updated friendship object

**DELETE /api/friends/{friendship_id}**
- Headers: Authorization Bearer token
- Deletes friendship (works for rejecting or removing friends)
- Returns: `{ message: "Friendship removed" }`

### Posts Endpoints

**GET /api/feed**
- Headers: Authorization Bearer token
- Query params: `?limit=20&offset=0`
- Returns: Paginated feed of active (non-expired) posts from friends
- Sorted by created_at DESC
- Includes: user info, media, song, prompt response

**GET /api/posts/my-posts**
- Headers: Authorization Bearer token
- Returns: Current user's posts (including expired for their own reference)

**POST /api/posts/wednesday-video**
- Headers: Authorization Bearer token
- Request: multipart/form-data
  - `video`: Video file (max 2min, required)
  - `prompt_response`: Text (optional)
  - `song_spotify_id`: String (optional)
  - `song_apple_music_id`: String (optional)
- Validation:
  - Today is Wednesday in user's timezone
  - No existing Wednesday video for today
  - Video duration ≤ 120 seconds
- Process:
  - Upload to S3/R2
  - Generate thumbnail
  - Set expires_at to created_at + 48 hours
  - Fetch song metadata from Spotify/Apple Music API
- Returns: Created post with media

**POST /api/posts/sunday-dump**
- Headers: Authorization Bearer token
- Request: multipart/form-data
  - `files[]`: Array of photos/videos (required, 1-20 items)
  - `prompt_response`: Text (optional)
  - `song_spotify_id`: String (optional)
  - `song_apple_music_id`: String (optional)
- Validation:
  - Today is Sunday in user's timezone
  - Each video ≤ 300 seconds
- Process:
  - Upload all files to S3/R2
  - Generate thumbnails for videos
  - Maintain upload order
  - Set expires_at to created_at + 48 hours
- Returns: Created post with all media

**DELETE /api/posts/{post_id}**
- Headers: Authorization Bearer token
- Validates: User owns the post
- Deletes post and all associated media from storage
- Returns: `{ message: "Post deleted" }`

### Prompts Endpoints

**GET /api/prompts/current**
- Headers: Authorization Bearer token
- Returns: Current week's prompt (based on week_start_date)

**POST /api/prompts** (Admin only)
- Headers: Authorization Bearer token
- Request body: `{ prompt_text, week_start_date }`
- Returns: Created prompt

**GET /api/prompts/history**
- Headers: Authorization Bearer token
- Returns: Past prompts for reference

### Music Integration Endpoints

**GET /api/music/spotify/search?q={query}**
- Headers: Authorization Bearer token
- Searches Spotify for songs
- Returns: Array of tracks with id, title, artist, album art, preview URL

**GET /api/music/apple/search?q={query}**
- Headers: Authorization Bearer token
- Searches Apple Music for songs
- Returns: Array of tracks with id, title, artist, album art, preview URL

---

## BACKEND IMPLEMENTATION DETAILS

### File Upload Handling
```python
# S3/R2 configuration
- Bucket structure: /{user_id}/{post_id}/{filename}
- File naming: Use UUID for uniqueness
- Video processing: 
  - Accept formats: mp4, mov, webm
  - Generate thumbnail at 2-second mark using FFmpeg
  - Validate duration using FFmpeg probe
- Photo processing:
  - Accept formats: jpg, jpeg, png, heic, webp
  - Resize to max 1920px width (maintain aspect ratio)
  - Generate thumbnail 400px width
- Security:
  - Validate file types (magic bytes, not just extension)
  - Scan for malware (ClamAV or cloud service)
  - Set Content-Type headers correctly
  - Use signed URLs with expiration
```

### Video Duration Validation
```python
# Use FFmpeg to get accurate duration
import subprocess
import json

def get_video_duration(file_path):
    cmd = [
        'ffprobe',
        '-v', 'quiet',
        '-print_format', 'json',
        '-show_format',
        file_path
    ]
    result = subprocess.run(cmd, capture_output=True, text=True)
    data = json.loads(result.stdout)
    return float(data['format']['duration'])
```

### Timezone Handling
```python
# Use pytz for timezone conversions
import pytz
from datetime import datetime

def is_wednesday_in_user_timezone(user_timezone):
    user_tz = pytz.timezone(user_timezone)
    user_time = datetime.now(user_tz)
    return user_time.weekday() == 2  # 2 = Wednesday

def is_sunday_in_user_timezone(user_timezone):
    user_tz = pytz.timezone(user_timezone)
    user_time = datetime.now(user_tz)
    return user_time.weekday() == 6  # 6 = Sunday
```

### Content Expiration Job
```python
# Celery periodic task (runs every hour)
from celery import Celery
from datetime import datetime

@celery.task
def expire_old_posts():
    # Find posts where expires_at < now and is_expired = False
    expired_posts = db.query(Post).filter(
        Post.expires_at < datetime.utcnow(),
        Post.is_expired == False
    ).all()
    
    for post in expired_posts:
        # Delete all media files from S3/R2
        for media in post.media:
            delete_from_storage(media.file_url)
            delete_from_storage(media.thumbnail_url)
        
        # Mark as expired (keep metadata for analytics)
        post.is_expired = True
        db.commit()
```

### Spotify API Integration
```python
# Use spotipy library
import spotipy
from spotipy.oauth2 import SpotifyClientCredentials

sp = spotipy.Spotify(auth_manager=SpotifyClientCredentials(
    client_id=SPOTIFY_CLIENT_ID,
    client_secret=SPOTIFY_CLIENT_SECRET
))

def search_spotify_tracks(query):
    results = sp.search(q=query, type='track', limit=10)
    tracks = []
    for item in results['tracks']['items']:
        tracks.append({
            'id': item['id'],
            'title': item['name'],
            'artist': item['artists'][0]['name'],
            'album_art': item['album']['images'][0]['url'],
            'preview_url': item['preview_url']
        })
    return tracks
```

### Apple Music API Integration
```python
# Use applemusicpy or direct REST API
import requests

def search_apple_music(query):
    url = 'https://api.music.apple.com/v1/catalog/us/search'
    headers = {'Authorization': f'Bearer {APPLE_MUSIC_TOKEN}'}
    params = {'term': query, 'types': 'songs', 'limit': 10}
    
    response = requests.get(url, headers=headers, params=params)
    data = response.json()
    
    tracks = []
    for item in data['results']['songs']['data']:
        tracks.append({
            'id': item['id'],
            'title': item['attributes']['name'],
            'artist': item['attributes']['artistName'],
            'album_art': item['attributes']['artwork']['url'],
            'preview_url': item['attributes']['previews'][0]['url']
        })
    return tracks
```

---

## FRONTEND IMPLEMENTATION

### Project Structure
```
src/
├── components/
│   ├── auth/
│   │   ├── LoginForm.tsx
│   │   ├── RegisterForm.tsx
│   │   └── ProtectedRoute.tsx
│   ├── feed/
│   │   ├── FeedContainer.tsx
│   │   ├── PostCard.tsx
│   │   ├── VideoPlayer.tsx
│   │   ├── PhotoGallery.tsx
│   │   └── CountdownTimer.tsx
│   ├── post/
│   │   ├── WednesdayVideoRecorder.tsx
│   │   ├── SundayDumpUploader.tsx
│   │   ├── PromptInput.tsx
│   │   └── SongSelector.tsx
│   ├── friends/
│   │   ├── FriendsList.tsx
│   │   ├── FriendRequests.tsx
│   │   └── UserSearch.tsx
│   ├── profile/
│   │   ├── ProfileView.tsx
│   │   └── ProfileEdit.tsx
│   └── shared/
│       ├── Header.tsx
│       ├── BottomNav.tsx
│       ├── LoadingSpinner.tsx
│       └── ErrorBoundary.tsx
├── contexts/
│   ├── AuthContext.tsx
│   └── ThemeContext.tsx
├── hooks/
│   ├── useAuth.ts
│   ├── useFeed.ts
│   ├── useVideoRecorder.ts
│   └── useFileUpload.ts
├── services/
│   ├── api.ts
│   ├── auth.ts
│   ├── posts.ts
│   └── storage.ts
├── utils/
│   ├── validators.ts
│   ├── formatters.ts
│   └── constants.ts
├── types/
│   └── index.ts
├── App.tsx
├── main.tsx
└── sw.ts (Service Worker)
```

### Key React Components

**1. WednesdayVideoRecorder Component**
```typescript
// Features:
- Check if today is Wednesday
- Display "Come back Wednesday!" message if not
- Check if user already posted today
- Use MediaRecorder API to record video
- Show real-time recording timer (max 2min)
- Preview recorded video before upload
- Integrate prompt response input
- Integrate song selector
- Show upload progress
- Handle errors (camera permissions, file size, etc.)

// Implementation notes:
- Use navigator.mediaDevices.getUserMedia() for camera access
- Use MediaRecorder with mimeType 'video/webm' or 'video/mp4'
- Implement stop at 2-minute mark automatically
- Convert Blob to File for upload
- Show countdown during recording
```

**2. SundayDumpUploader Component**
```typescript
// Features:
- Check if today is Sunday
- Allow multiple file selection (photos + videos)
- Preview thumbnails in grid before upload
- Drag-to-reorder functionality
- Video duration validation (max 5min each)
- Show total upload size
- Batch upload with progress bar
- Integrate prompt response input
- Integrate song selector

// Implementation notes:
- Use input type="file" multiple accept="image/*,video/*"
- Validate each file client-side before upload
- Use FormData for multipart upload
- Show individual progress for each file
- Handle partial upload failures
```

**3. FeedContainer Component**
```typescript
// Features:
- Infinite scroll pagination
- Pull-to-refresh
- Loading states
- Empty state ("No posts yet, invite friends!")
- Filter by post type (optional)
- Real-time countdown timers on each post

// Implementation notes:
- Use React Query for data fetching and caching
- Implement intersection observer for infinite scroll
- Update timers every minute
- Remove expired posts from feed automatically
```

**4. PostCard Component**
```typescript
// Features:
- User profile picture and name
- Post type badge (Wednesday Video / Sunday Dump)
- Time posted (e.g., "2 hours ago")
- Countdown to expiration (e.g., "Expires in 38h 24m")
- Video player with controls (for Wednesday)
- Photo/video gallery (for Sunday dumps)
- Song preview player if attached
- Prompt response if included
- Like button (optional future feature)

// Implementation notes:
- Use HTML5 video element with custom controls
- Implement swipeable gallery for Sunday dumps
- Color-code expiration timer (green > yellow > red)
- Lazy load videos (don't autoplay all)
```

**5. CountdownTimer Component**
```typescript
// Features:
- Display time remaining until expiration
- Update every minute
- Color changes based on time left:
  - > 24 hours: green
  - 12-24 hours: yellow
  - < 12 hours: red
- Show "Expired" when time is up

// Implementation notes:
- Use setInterval for updates
- Calculate difference between expires_at and current time
- Format as "Xh Ym" or "Xm" if < 1 hour
- Clean up interval on unmount
```

### PWA Features

**manifest.json**
```json
{
  "name": "FriendCircle",
  "short_name": "FriendCircle",
  "description": "Stay connected with your closest friends",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#ffffff",
  "theme_color": "#6366f1",
  "icons": [
    {
      "src": "/icon-192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "/icon-512.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ],
  "orientation": "portrait"
}
```

**Service Worker (sw.ts)**
```typescript
// Cache strategies:
- Cache-first: Static assets (CSS, JS, images)
- Network-first: API calls
- Stale-while-revalidate: Profile pictures, thumbnails

// Features:
- Offline page when network unavailable
- Background sync for failed uploads
- Push notifications for new posts from friends
- Cache video thumbnails for offline viewing
```

**Push Notifications**
```typescript
// Setup Firebase Cloud Messaging
// Trigger notifications for:
- New friend request
- Friend request accepted
- New post from friend (max 1 per day to avoid spam)
- Reminder on Wednesday/Sunday to post

// Implementation:
- Request notification permission on first login
- Store FCM token in database
- Send from backend when events occur
- Handle notification click to open specific post
```

### State Management

**AuthContext**
```typescript
interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  register: (data: RegisterData) => Promise<void>;
  isLoading: boolean;
}

// Store JWT in localStorage or sessionStorage
// Store refresh token in httpOnly cookie (set by backend)
// Auto-refresh access token when expired
// Redirect to login on 401 errors
```

**React Query Setup**
```typescript
// Query keys:
const queryKeys = {
  feed: ['feed'],
  myPosts: ['posts', 'me'],
  friends: ['friends'],
  friendRequests: ['friends', 'requests'],
  currentPrompt: ['prompts', 'current'],
};

// Mutations:
- createWednesdayVideo
- createSundayDump
- sendFriendRequest
- acceptFriendRequest
- updateProfile
```

### Routing Structure
```typescript
<Routes>
  <Route path="/login" element={<Login />} />
  <Route path="/register" element={<Register />} />
  
  {/* Protected routes */}
  <Route element={<ProtectedRoute />}>
    <Route path="/" element={<Feed />} />
    <Route path="/post/wednesday" element={<WednesdayPost />} />
    <Route path="/post/sunday" element={<SundayPost />} />
    <Route path="/friends" element={<Friends />} />
    <Route path="/profile" element={<Profile />} />
    <Route path="/settings" element={<Settings />} />
  </Route>
  
  <Route path="*" element={<NotFound />} />
</Routes>
```

### Mobile-First Design Patterns

**Bottom Navigation**
```typescript
// Tabs:
- Home (Feed)
- Post (+ icon, opens modal to choose Wednesday/Sunday)
- Friends
- Profile

// Always visible, sticky to bottom
// Active state highlighting
```

**Touch Interactions**
- Swipe to navigate between photos in Sunday dump
- Pull-to-refresh on feed
- Long-press on post for options (delete if yours)
- Tap to play/pause videos

**Responsive Breakpoints**
```css
/* Mobile-first approach */
/* Base styles: 320px+ (mobile) */
/* sm: 640px+ (large mobile) */
/* md: 768px+ (tablet) */
/* lg: 1024px+ (desktop - rare for this app) */
```

---

## FILE UPLOAD IMPLEMENTATION

### Frontend Upload Logic
```typescript
async function uploadWednesdayVideo(
  videoBlob: Blob,
  promptResponse?: string,
  songId?: string
) {
  const formData = new FormData();
  formData.append('video', videoBlob, 'wednesday-video.webm');
  if (promptResponse) formData.append('prompt_response', promptResponse);
  if (songId) formData.append('song_spotify_id', songId);

  const response = await axios.post('/api/posts/wednesday-video', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
    onUploadProgress: (progressEvent) => {
      const percentage = (progressEvent.loaded * 100) / progressEvent.total;
      setUploadProgress(percentage);
    }
  });
  
  return response.data;
}
```

### Backend Upload Processing (FastAPI)
```python
from fastapi import UploadFile, File, Form
import boto3
from uuid import uuid4

@router.post("/posts/wednesday-video")
async def create_wednesday_video(
    video: UploadFile = File(...),
    prompt_response: str = Form(None),
    song_spotify_id: str = Form(None),
    current_user: User = Depends(get_current_user)
):
    # Validate day of week
    if not is_wednesday_in_user_timezone(current_user.timezone):
        raise HTTPException(400, "Wednesday videos can only be posted on Wednesdays")
    
    # Check for existing Wednesday video today
    existing = db.query(Post).filter(
        Post.user_id == current_user.id,
        Post.post_type == 'wednesday_video',
        func.date(Post.created_at) == date.today()
    ).first()
    if existing:
        raise HTTPException(400, "You've already posted a Wednesday video today")
    
    # Save video to temp location
    temp_path = f"/tmp/{uuid4()}.webm"
    with open(temp_path, "wb") as f:
        f.write(await video.read())
    
    # Validate duration
    duration = get_video_duration(temp_path)
    if duration > 120:
        os.remove(temp_path)
        raise HTTPException(400, "Video must be 2 minutes or less")
    
    # Upload to S3/R2
    s3_key = f"{current_user.id}/{uuid4()}/{video.filename}"
    s3_client.upload_file(temp_path, BUCKET_NAME, s3_key)
    video_url = f"https://{BUCKET_NAME}.s3.amazonaws.com/{s3_key}"
    
    # Generate thumbnail
    thumbnail_path = generate_thumbnail(temp_path)
    thumbnail_key = f"{s3_key}.thumb.jpg"
    s3_client.upload_file(thumbnail_path, BUCKET_NAME, thumbnail_key)
    thumbnail_url = f"https://{BUCKET_NAME}.s3.amazonaws.com/{thumbnail_key}"
    
    # Fetch song metadata if provided
    song_data = None
    if song_spotify_id:
        song_data = get_spotify_track_details(song_spotify_id)
    
    # Create post
    post = Post(
        user_id=current_user.id,
        post_type='wednesday_video',
        expires_at=datetime.utcnow() + timedelta(hours=48),
        prompt_response=prompt_response,
        song_spotify_id=song_spotify_id,
        song_title=song_data['title'] if song_data else None,
        song_artist=song_data['artist'] if song_data else None,
        song_album_art_url=song_data['album_art'] if song_data else None,
        song_preview_url=song_data['preview_url'] if song_data else None
    )
    db.add(post)
    db.flush()
    
    # Create media entry
    media = Media(
        post_id=post.id,
        media_type='video',
        file_url=video_url,
        thumbnail_url=thumbnail_url,
        duration_seconds=int(duration)
    )
    db.add(media)
    db.commit()
    
    # Clean up temp files
    os.remove(temp_path)
    os.remove(thumbnail_path)
    
    return post
```

---

## SECURITY CONSIDERATIONS

### Authentication Security
- Password hashing: bcrypt with cost factor 12
- JWT tokens: Short expiration (15 minutes) for access tokens
- Refresh tokens: Longer expiration (7 days), stored in httpOnly cookies
- Token rotation: Issue new refresh token on each refresh
- Logout: Revoke refresh tokens server-side

### API Security
- Rate limiting: 100 requests/minute per user
- CORS: Whitelist only frontend domain
- Input validation: Pydantic models for all inputs
- SQL injection prevention: Use ORM (SQLAlchemy)
- XSS prevention: Sanitize all user inputs
- CSRF protection: For cookie-based auth

### File Upload Security
- File type validation: Check magic bytes, not just extension
- File size limits: 50MB for videos, 10MB for photos
- Virus scanning: ClamAV or cloud service
- Signed URLs: Use pre-signed URLs with expiration for S3/R2
- Content-Type verification: Set and validate Content-Type headers

### Privacy
- Friend-only content: Validate friendship before showing posts
- No public profiles: All profiles private by default
- Data retention: Delete expired content from storage
- Account deletion: Cascade delete all user data

---

## DEPLOYMENT CHECKLIST

### Environment Variables
```bash
# Backend
DATABASE_URL=postgresql://user:pass@host:5432/dbname
SECRET_KEY=your-jwt-secret-key-here
REFRESH_SECRET_KEY=your-refresh-token-secret
AWS_ACCESS_KEY_ID=your-aws-key
AWS_SECRET_ACCESS_KEY=your-aws-secret
AWS_S3_BUCKET=your-bucket-name
AWS_REGION=us-east-1
SPOTIFY_CLIENT_ID=your-spotify-id
SPOTIFY_CLIENT_SECRET=your-spotify-secret
APPLE_MUSIC_TOKEN=your-apple-music-token
REDIS_URL=redis://localhost:6379
CELERY_BROKER_URL=redis://localhost:6379
FRONTEND_URL=https://yourapp.com

# Frontend
VITE_API_URL=https://api.yourapp.com
VITE_FIREBASE_CONFIG={"apiKey": "...", ...}
```

### Database Setup
```bash
# Run migrations
alembic upgrade head

# Create admin user (for prompts)
python scripts/create_admin.py

# Set up weekly prompt cron job
```

### Celery Setup
```bash
# Start Celery worker
celery -A tasks worker --loglevel=info

# Start Celery beat (scheduler)
celery -A tasks beat --loglevel=info

# Celery task: Expire old posts (runs every hour)
```

### Monitoring & Logging
- Application logs: Use Sentry for error tracking
- Performance monitoring: New Relic or Datadog
- Uptime monitoring: UptimeRobot or Pingdom
- Database backups: Daily automated backups
- Storage costs: Monitor S3/R2 usage

---

## TESTING REQUIREMENTS

### Backend Tests
```python
# Test coverage:
- Authentication (login, register, refresh, logout)
- Wednesday video posting (validation, upload, expiration)
- Sunday dump posting (multiple files, ordering)
- Friend requests (sending, accepting, 15-friend limit)
- Feed (pagination, filtering expired content)
- Content expiration (Celery task)
- File upload (validation, storage)

# Use pytest with fixtures for database and user creation
```

### Frontend Tests
```typescript
// Test coverage:
- Component rendering (all major components)
- Video recording (MediaRecorder integration)
- File upload (multiple files, progress)
- Form validation (login, register, post creation)
- Authentication flow (login, logout, protected routes)
- Timer countdown (expires_at calculation)

// Use Vitest + React Testing Library
```

### Manual Testing Checklist
- [ ] Record Wednesday video on Wednesday
- [ ] Attempt Wednesday video on non-Wednesday (should fail)
- [ ] Upload Sunday dump with 10 photos/videos
- [ ] Verify 48-hour expiration countdown
- [ ] Send friend request and accept
- [ ] Attempt to add 16th friend (should fail)
- [ ] Search and play Spotify song
- [ ] Respond to weekly prompt
- [ ] View feed with multiple posts
- [ ] Test on iOS Safari and Android Chrome
- [ ] Test PWA installation
- [ ] Test offline functionality
- [ ] Test push notifications
- [ ] Verify expired content is deleted from storage

---

## FUTURE ENHANCEMENTS (Post-MVP)

### Phase 2 Features
- Comments on posts (text only, no media)
- Reactions (emoji reactions instead of likes)
- Streaks (track consecutive weeks of posting)
- Memories (show "1 year ago today" posts)
- Export your data (download all your posts)

### Phase 3 Features
- Group chats (text messaging within the app)
- Collaborative playlists (shared Spotify playlists)
- Photo filters and video effects
- Voice notes (audio recordings for posts)

### Native Mobile App Considerations
- When ready for native: React Native or Flutter
- Reuse backend API (no changes needed)
- Better camera integration
- Background upload (continue uploading when app minimized)
- Better push notifications
- App Store and Google Play distribution

---

## PERFORMANCE OPTIMIZATION

### Frontend
- Code splitting: Lazy load routes
- Image optimization: Use next-gen formats (WebP, AVIF)
- Video optimization: Compress videos before upload (client-side)
- Caching: Cache API responses with React Query
- Service Worker: Cache static assets and thumbnails

### Backend
- Database indexing: Index frequently queried columns
- Query optimization: Use select_related/join to reduce queries
- Caching: Redis cache for feed and user data
- CDN: Serve static files and media through CDN
- Compression: Gzip/Brotli for API responses

### Storage
- Video compression: Use FFmpeg to compress uploads
- Thumbnail generation: Generate multiple sizes
- Lazy loading: Don't load all feed videos at once
- Signed URLs: Generate on-demand, cache for 1 hour

---

## ESTIMATED TIMELINE

**Week 1-2: Setup & Authentication**
- Project setup (FastAPI + React)
- Database schema and migrations
- User registration and login
- JWT authentication

**Week 3-4: Core Posting Features**
- Wednesday video recording and upload
- Sunday dump multiple file upload
- File storage (S3/R2) integration
- Basic feed display

**Week 5-6: Friends & Social**
- Friend request system
- Friend limit enforcement
- Feed filtering (show only friends' posts)
- User search

**Week 7-8: Polish & Additional Features**
- Content expiration (48-hour timer)
- Weekly prompts
- Spotify/Apple Music integration
- Push notifications

**Week 9-10: PWA & Testing**
- Service worker implementation
- PWA manifest and icons
- Comprehensive testing
- Bug fixes and optimization

**Week 11-12: Deployment & Launch**
- Deploy backend and frontend
- Set up monitoring and logging
- Beta testing with friends
- Iterate based on feedback

---

## SUCCESS METRICS

### Technical Metrics
- API response time: < 200ms for feed
- Video upload success rate: > 95%
- App load time: < 2 seconds
- Crash rate: < 1%
- Uptime: 99.9%

### User Engagement Metrics
- Weekly active users: Track % of users posting each week
- Wednesday video completion rate: % of users who post Wednesday videos
- Sunday dump completion rate: % of users who post Sunday dumps
- Friend connections: Average number of friends per user
- Content expiration: Verify no content older than 48 hours exists

### Cost Metrics
- Storage costs: Track monthly S3/R2 costs
- Bandwidth: Monitor CDN usage
- Server costs: Keep under $25/month for 15 users
- Total monthly cost: Target < $50/month

---

This specification should give you everything needed to prompt Cursor or another AI coding assistant to build the full application. Start with authentication and the database, then build posting features, then add friends and polish.

Good luck with your project! 🚀
