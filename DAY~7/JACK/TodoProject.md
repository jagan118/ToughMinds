# Todo List App - Complete Implementation Plan

## Project Overview
Build a full-stack todo application with user authentication and database persistence using Angular, Express, and MongoDB.

---

## Tech Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Frontend** | Angular (standalone components) | User interface |
| **Backend** | Node.js + Express | REST API server |
| **Database** | MongoDB | Data persistence |
| **Authentication** | JWT + localStorage | User sessions |
| **API** | REST endpoints | Client-server communication |

---

## Architecture Overview

```
┌─────────────────────┐
│  Angular Frontend   │
│   (localhost:4200)  │
└──────────┬──────────┘
           │ (HTTP + JWT)
┌──────────▼──────────┐
│  Express Backend    │
│   (localhost:3000)  │
└──────────┬──────────┘
           │ (Queries)
┌──────────▼──────────┐
│    MongoDB Atlas    │
│   (Cloud Database)  │
└─────────────────────┘
```

**Data Flow:**
1. User signs up → Password hashed → Stored in DB
2. User logs in → JWT token generated → Sent to frontend
3. Frontend stores JWT in localStorage
4. Every request includes JWT in header (via interceptor)
5. Server validates JWT → Returns user's todos
6. Todos fetched from DB → Displayed in Angular

---

## Phase 1: Project Setup (Day 1)

### Step 1.1: Create Backend Project

**What to do:**
1. Create folder: `todo-app-backend`
2. Initialize Node.js: `npm init -y`
3. Install dependencies:
   ```bash
   npm install express mongoose cors dotenv bcryptjs jsonwebtoken
   npm install -D nodemon
   ```

**Why?**
- `express`: Web framework
- `mongoose`: MongoDB connection + models
- `bcryptjs`: Password hashing
- `jsonwebtoken`: JWT generation
- `dotenv`: Environment variables

### Step 1.2: Create Frontend Project

**What to do:**
1. Create Angular project:
   ```bash
   ng new todo-app-frontend
   cd todo-app-frontend
   ng serve
   ```
2. Choose: Standalone components: YES
3. Confirm running on `localhost:4200`

### Step 1.3: Create MongoDB Database

**What to do:**
1. Go to mongodb.com
2. Create free cluster (MongoDB Atlas)
3. Create database: `todo_db`
4. Create user credentials (username + password)
5. Get connection string
6. Save to `.env` file in backend

**Why?** Cloud database = accessible anywhere, automatic backups

### Step 1.4: Test Backend Connection

**What to do:**
1. Create `server.js` in backend
2. Connect to MongoDB using mongoose
3. Start server: `npm start`
4. Confirm: "Connected to MongoDB" message appears

✅ **Checkpoint:** Backend runs without errors

---

## Phase 2: Backend Development (Days 2-3)

### Step 2.1: Create Database Models

**File:** `models/User.js`

**What to do:**
1. Define User schema with fields:
   - email (string, unique, required)
   - password (string, hashed, required)
   - name (string, required)
   - createdAt (Date, auto)

2. Add pre-save hook to hash password before saving
3. Export User model

**Why?** Schema defines structure of data in DB

### Step 2.2: Create Todo Model

**File:** `models/Todo.js`

**What to do:**
1. Define Todo schema with fields:
   - title (string, required)
   - description (string, optional)
   - completed (boolean, default: false)
   - userId (reference to User, required)
   - dueDate (Date, optional)
   - category (string, optional)
   - createdAt (Date, auto)
   - updatedAt (Date, auto)

2. Export Todo model

**Why?** Separate model for todos linked to users

### Step 2.3: Create Authentication Routes

**File:** `routes/auth.js`

**What to do:**

**Signup Endpoint:**
1. Accept: email, password, name
2. Check if email already exists
3. Hash password using bcrypt
4. Create new user in DB
5. Return: user data (NO password)

**Login Endpoint:**
1. Accept: email, password
2. Find user by email
3. Compare password with bcrypt
4. If valid: Generate JWT token
5. Return: JWT token + user data

**Logout Endpoint:**
1. Clear token from frontend localStorage (handled by frontend)

### Step 2.4: Create Middleware for JWT Verification

**File:** `middleware/auth.js`

**What to do:**
1. Create function that:
   - Extracts JWT from request header
   - Verifies JWT token
   - Decodes JWT to get userId
   - Attaches userId to request object
   - Passes to next middleware

2. Apply this middleware to protected routes (todos)

**Why?** Middleware protects todo routes from unauthorized access

### Step 2.5: Create Todo Routes

**File:** `routes/todos.js`

**What to do:**

**GET /todos**
- Protected route (requires JWT)
- Query DB: Find all todos where userId = authenticated userId
- Return: Array of todos

**POST /todos**
- Protected route
- Accept: title, description, dueDate, category
- Validate: title required
- Create new todo with userId from JWT
- Return: newly created todo

**PUT /todos/:id**
- Protected route
- Accept: updated fields (title, description, dueDate, category)
- Verify: todo belongs to authenticated user
- Update in DB
- Return: updated todo

**DELETE /todos/:id**
- Protected route
- Verify: todo belongs to authenticated user
- Delete from DB
- Return: success message

**PATCH /todos/:id/toggle**
- Protected route
- Toggle completed status
- Update in DB
- Return: updated todo

**GET /todos/search?q=**
- Protected route
- Query string: q (search query)
- Find todos where title/description includes query
- Return: filtered todos

### Step 2.6: Create Error Handling Middleware

**What to do:**
1. Catch all errors in routes
2. Check error type (validation, auth, database, etc.)
3. Return appropriate status code + message
4. Log errors to console

**Why?** User-friendly error responses

### Step 2.7: Configure CORS

**What to do:**
1. In `server.js`, add CORS middleware
2. Allow requests from `http://localhost:4200`
3. Allow credentials (for JWT in headers)

**Why?** Frontend (4200) can call backend (3000)

### Step 2.8: Test Backend APIs

**What to do:**
1. Use Postman or Thunder Client
2. Test each endpoint:
   - POST /auth/signup → Create user
   - POST /auth/login → Get JWT token
   - GET /todos → Should fail (no JWT)
   - Add JWT to header: `Authorization: Bearer <token>`
   - GET /todos → Should work
   - POST /todos → Create todo
   - Verify todo appears in GET /todos
   - PUT /todos/:id → Update
   - DELETE /todos/:id → Delete

✅ **Checkpoint:** All backend APIs working

---

## Phase 3: Frontend Setup (Day 3)

### Step 3.1: Create TypeScript Interfaces

**File:** `src/app/models/interfaces.ts`

**What to do:**
1. Create `User` interface:
   - id: string
   - email: string
   - name: string
   - token?: string

2. Create `Todo` interface:
   - _id: string
   - title: string
   - description: string
   - completed: boolean
   - userId: string
   - dueDate: Date
   - category: string
   - createdAt: Date

3. Create `AuthResponse` interface:
   - user: User
   - token: string

**Why?** Type safety in TypeScript

### Step 3.2: Create Auth Service

**File:** `src/app/services/auth.service.ts`

**What to do:**
1. Inject HttpClient
2. Create BehaviorSubject for current user (observable)
3. Create signal for auth state (for template)

**Methods:**
- `signup(email, password, name)` → POST /auth/signup
- `login(email, password)` → POST /auth/login
- `logout()` → Clear localStorage + update signals
- `getToken()` → Return token from localStorage
- `isLoggedIn()` → Return true if token exists
- `getCurrentUser()` → Return current user from signal

**Error handling:** Return error message if API fails

**Why?** Centralize auth logic

### Step 3.3: Create Todo Service

**File:** `src/app/services/todo.service.ts`

**What to do:**
1. Inject HttpClient
2. Create signal for todos array
3. Create BehaviorSubject for todos (observable)

**Methods:**
- `getTodos()` → GET /todos (returns todos signal)
- `createTodo(title, description, dueDate, category)` → POST /todos
- `updateTodo(id, updatedData)` → PUT /todos/:id
- `deleteTodo(id)` → DELETE /todos/:id
- `toggleComplete(id)` → PATCH /todos/:id/toggle
- `searchTodos(query)` → GET /todos/search?q=query
- `sortTodos(by)` → Sort todos array (by: dueDate, title)

**Why?** All todo operations in one place

### Step 3.4: Create Auth Interceptor

**File:** `src/app/interceptors/auth.interceptor.ts`

**What to do:**
1. Implement HttpInterceptor
2. In intercept method:
   - Get JWT token from localStorage
   - If token exists: Clone request + add header `Authorization: Bearer <token>`
   - Call next.handle(modifiedRequest)
3. Handle errors: If 401 → logout + redirect to login

**Register in app.config.ts:**
- Add to providers: HTTP_INTERCEPTORS

**Why?** Automatically add JWT to every request

### Step 3.5: Create Auth Guard

**File:** `src/app/guards/auth.guard.ts`

**What to do:**
1. Implement CanActivate
2. In canActivate method:
   - Check if user is logged in (isLoggedIn() from authService)
   - If yes: return true (allow access)
   - If no: navigate to /login + return false (block access)

**Why?** Protect /dashboard from unauthorized users

### Step 3.6: Configure Routes

**File:** `src/app/app.routes.ts`

**What to do:**
1. Define routes:
   - `/login` → LoginComponent (public)
   - `/signup` → SignupComponent (public)
   - `/dashboard` → DashboardComponent (protected by AuthGuard)
   - `/todos` → TodoListComponent (protected)
   - `/todos/:id/edit` → EditTodoComponent (protected)
   - `/` → Redirect to `/dashboard`

2. Apply AuthGuard to protected routes

**Why?** Navigation structure

### Step 3.7: Enable HttpClient

**File:** `src/app/app.config.ts`

**What to do:**
1. Add `provideHttpClient(withFetch())`
2. Add `HTTP_INTERCEPTORS` provider with AuthInterceptor

**Why?** Makes HttpClient + interceptor available globally

### Step 3.8: Create Directory Structure

**What to do:**
1. Create folders:
   - `src/app/components/auth/`
   - `src/app/components/todo/`
   - `src/app/services/`
   - `src/app/guards/`
   - `src/app/interceptors/`
   - `src/app/models/`

✅ **Checkpoint:** Frontend structure ready

---

## Phase 4: Authentication UI (Day 4)

### Step 4.1: Create Signup Component

**File:** `src/app/components/auth/signup.component.ts`

**What to do:**
1. Create reactive form with:
   - email (required, email format)
   - password (required, min 6 chars, uppercase + lowercase + number)
   - name (required, min 3 chars)

2. On submit:
   - Validate form
   - Call authService.signup()
   - If success: Navigate to /login
   - If error: Show error message

3. Add "Already have account?" link to /login

**Template:**
- Form with 3 inputs
- Validation error messages
- Submit button
- Loading state (while API call)

### Step 4.2: Create Login Component

**File:** `src/app/components/auth/login.component.ts`

**What to do:**
1. Create reactive form with:
   - email (required)
   - password (required)

2. On submit:
   - Validate form
   - Call authService.login()
   - If success: Navigate to /dashboard
   - If error: Show error message

3. Add "Don't have account?" link to /signup

**Template:**
- Form with 2 inputs
- Validation error messages
- Submit button
- Loading state

### Step 4.3: Create Navbar Component

**File:** `src/app/components/navbar.component.ts`

**What to do:**
1. Display username (from authService.getCurrentUser())
2. Add Logout button
3. Show only if logged in (use signal)

**On logout:**
- Call authService.logout()
- Navigate to /login

**Template:**
- Logo/title on left
- Username in center
- Logout button on right

✅ **Checkpoint:** Authentication flow working

---

## Phase 5: Todo CRUD UI (Day 5)

### Step 5.1: Create Todo List Component

**File:** `src/app/components/todo/todo-list.component.ts`

**What to do:**
1. In ngOnInit:
   - Call todoService.getTodos()
   - Subscribe and update signal

2. Create methods:
   - `deleteTodo(id)` → Call service + confirm
   - `toggleComplete(id)` → Call service
   - `openEditModal(id)` → Navigate to edit page
   - `refreshList()` → Reload todos

3. Add signals:
   - `todos` (from service)
   - `loading` (while fetching)
   - `searchQuery` (for search)

**Template:**
- Search input (two-way binding with signal)
- Filter buttons (All/Completed/Pending)
- Sort dropdown (by date, by title)
- List of todo items using *ngFor
- Add Todo button

### Step 5.2: Create Todo Item Component

**File:** `src/app/components/todo/todo-item.component.ts`

**What to do:**
1. Accept @Input todo (single todo object)
2. Emit @Output events:
   - deleteClick → Parent deletes
   - completeClick → Parent toggles
   - editClick → Parent navigates to edit

3. Display:
   - Title
   - Description (truncated)
   - Due date (formatted)
   - Category (if exists)
   - Completed checkbox
   - Delete button
   - Edit button

**Template:**
- Card layout
- Display all fields
- Buttons for actions

### Step 5.3: Create Add Todo Component

**File:** `src/app/components/todo/add-todo.component.ts`

**What to do:**
1. Create reactive form with:
   - title (required, max 100)
   - description (optional, max 500)
   - dueDate (optional, future date)
   - category (optional, dropdown)

2. On submit:
   - Validate form
   - Call todoService.createTodo()
   - Reset form
   - Show success message
   - Refresh list

**Template:**
- Form with all fields
- Validation errors
- Submit button
- Cancel button

### Step 5.4: Create Edit Todo Component

**File:** `src/app/components/todo/edit-todo.component.ts`

**What to do:**
1. Get todo ID from route params
2. Call todoService.getTodo(id) to fetch
3. Populate form with existing data
4. On submit:
   - Validate form
   - Call todoService.updateTodo(id, updatedData)
   - Show success message
   - Navigate back to list

**Template:**
- Pre-filled form
- Submit button (Update)
- Cancel button

### Step 5.5: Create Dashboard Component

**File:** `src/app/components/dashboard.component.ts`

**What to do:**
1. Import: Navbar, TodoList, AddTodo components
2. Layout:
   - Navbar at top
   - Page title
   - Add Todo section
   - Todo List section

**Template:**
- Standard layout structure

✅ **Checkpoint:** All CRUD operations working

---

## Phase 6: Advanced Features (Day 5-6)

### Step 6.1: Implement Search with Debounce

**In Todo List Component:**

**What to do:**
1. Create search input
2. Use RxJS: debounceTime(500) → Wait 500ms after user stops typing
3. Use switchMap → Call todoService.searchTodos(query)
4. Update todos signal with results
5. If empty query → Show all todos

**Why?** Reduces API calls, improves performance

### Step 6.2: Implement Filter

**In Todo List Component:**

**What to do:**
1. Add filter buttons: All / Completed / Pending
2. Filter signal based on selected filter
3. Update *ngFor to display filtered todos

### Step 6.3: Implement Sort

**In Todo List Component:**

**What to do:**
1. Add sort dropdown: By Due Date / By Title / By Created Date
2. Call todoService.sortTodos(sortBy)
3. Update todos signal

### Step 6.4: Add Custom Pipe for Date Formatting

**File:** `src/app/pipes/format-date.pipe.ts`

**What to do:**
1. Create custom pipe
2. Format dueDate to: "Jan 15, 2024"
3. Use in todo-item template: `{{ todo.dueDate | formatDate }}`

**Why?** Consistent date display

### Step 6.5: Add Loading & Empty States

**What to do:**
1. Show spinner while fetching todos
2. Show "No todos" message if list empty
3. Show error message if API fails

**Template:**
```
*ngIf="loading()" → Show spinner
*ngIf="!loading() && todos().length === 0" → Show empty message
*ngIf="!loading() && todos().length > 0" → Show list
*ngIf="error()" → Show error message
```

### Step 6.6: Add Categories/Tags

**What to do:**
1. In Todo model: Add `category` field
2. In Add/Edit form: Add category dropdown
3. In filter: Add "Filter by Category"
4. Display category as badge in todo-item

---

## Phase 7: Styling & Polish (Day 6)

### Step 7.1: Dark Theme CSS

**What to do:**
1. Create global styles file
2. Define color variables (dark gray, accent colors)
3. Style components:
   - Forms: Input borders, focus states
   - Cards: Hover effects, shadows
   - Buttons: Hover, active, disabled states
   - Navbar: Dark background
   - Todo items: Card layout

### Step 7.2: Responsive Design

**What to do:**
1. Use CSS Grid/Flex for layouts
2. Mobile: 1 column
3. Tablet: 2 columns
4. Desktop: 3 columns

### Step 7.3: Animations

**What to do:**
1. Fade in/out todos when added/deleted
2. Slide animations for modals
3. Button hover animations
4. Loading spinner animation

---

## Phase 8: Error Handling & Testing (Day 7)

### Step 8.1: Error Handling

**What to do:**
1. In authService:
   - Email already exists error
   - Invalid credentials error
   - Network error

2. In todoService:
   - Todo not found error
   - Permission error (unauthorized)
   - Validation errors

3. In components:
   - Show error alerts
   - Log to console
   - Give users options to retry

### Step 8.2: Manual Testing Checklist

**Authentication:**
- [ ] Signup creates user
- [ ] Login returns JWT
- [ ] JWT stored in localStorage
- [ ] Without JWT → Redirected to login
- [ ] Invalid credentials → Error message
- [ ] Logout clears localStorage

**Todos:**
- [ ] Create todo appears in list
- [ ] Edit todo updates immediately
- [ ] Delete todo removed from list
- [ ] Toggle complete works
- [ ] Search filters todos
- [ ] Sort works
- [ ] Refresh page → Todos persist (from DB)

**Performance:**
- [ ] No console errors
- [ ] Page loads fast
- [ ] API calls efficient

### Step 8.3: Test in Postman (Backend)

**What to do:**
1. Test all endpoints manually
2. Verify response format
3. Check error handling
4. Test with/without JWT

---

## Implementation Checklist

### Backend
- [ ] Express server setup
- [ ] MongoDB connection
- [ ] User model + signup/login
- [ ] Todo model + CRUD
- [ ] JWT middleware
- [ ] Auth routes
- [ ] Todo routes
- [ ] Error handling
- [ ] CORS configured
- [ ] All APIs tested

### Frontend
- [ ] Angular project created
- [ ] Interfaces defined
- [ ] Services created (auth, todo)
- [ ] Interceptor created
- [ ] Guard created
- [ ] Routes configured
- [ ] Auth components (signup, login)
- [ ] Dashboard component
- [ ] Todo components (list, item, add, edit)
- [ ] Search + filter + sort
- [ ] Styling + responsive
- [ ] Error handling
- [ ] All features tested

### Database
- [ ] MongoDB Atlas account
- [ ] Database created
- [ ] User model
- [ ] Todo model
- [ ] Indexes created (for performance)

---

## Deployment

### Backend Deployment (Render or Heroku)

**What to do:**
1. Create `.env` file with:
   - MONGODB_URI
   - JWT_SECRET
   - PORT

2. Push to GitHub
3. Connect GitHub to Render
4. Deploy automatically
5. Note deployed URL (e.g., `https://todo-api.onrender.com`)

### Frontend Deployment (Netlify or Vercel)

**What to do:**
1. Update API URLs in services:
   - From `localhost:3000` to deployed backend URL
2. Build: `ng build`
3. Push to GitHub
4. Connect to Netlify/Vercel
5. Deploy
6. Test with deployed frontend + backend

### Database (MongoDB Atlas)

**Already done in Phase 1**
- Cloud database ready

---

## Key Concepts Applied

| Concept | Where | Why |
|---------|-------|-----|
| **Signals** | Store todos, auth state | Reactive updates |
| **Reactive Forms** | Auth, add/edit todos | Validation |
| **HttpClient** | API calls | Backend communication |
| **Interceptors** | Add JWT to headers | Auto-attach auth |
| **Route Guards** | Protect /dashboard | Authorization |
| **RxJS (switchMap, debounce)** | Search | Efficient API calls |
| **Custom Pipes** | Format dates | Reusable logic |
| **@Input/@Output** | Parent/child | Component communication |
| **ChangeDetectionStrategy.OnPush** | All components | Performance |
| **TrackBy** | Todo list *ngFor | Optimize rendering |
| **Services** | Auth, Todo | Centralize logic |
| **Dependency Injection** | All components | Inject services |
| **Error Handling** | Services, components | User feedback |
| **localStorage** | Store JWT | Persist auth |

---

## Common Issues & Solutions

| Issue | Solution |
|-------|----------|
| **CORS error** | Backend: Add cors() middleware, allow frontend URL |
| **401 Unauthorized** | Check JWT in header, verify token not expired |
| **Todo not updating** | Check signal is updated, refresh list manually |
| **Form not submitting** | Check validation, add (ngSubmit) event |
| **API call fails** | Check backend running, check URL, check CORS |
| **Token not persisting** | Check localStorage.setItem() in auth service |
| **Todos load but then disappear** | Check component refresh, avoid clearing signal |

---

## Timeline

| Phase | Days | Milestones |
|-------|------|-----------|
| **Phase 1** | 1 | Setup complete, DB connected |
| **Phase 2** | 2 | All backend APIs working |
| **Phase 3** | 1 | Frontend structure ready |
| **Phase 4** | 1 | Auth flow working |
| **Phase 5** | 1 | All CRUD operations working |
| **Phase 6** | 1 | Advanced features (search, filter, sort) |
| **Phase 7** | 1 | Styling + responsive |
| **Phase 8** | 1 | Testing + polish |
| **Deployment** | 1 | Live on web |
| **TOTAL** | **9 days** | **Complete production app** |

---

## Portfolio Tips

**When showing this project:**
1. Demo the app (create, edit, delete todos)
2. Show deployed live link
3. Explain architecture (3-tier: frontend, backend, database)
4. Mention tech stack
5. Highlight features (auth, search, filtering)
6. Point to GitHub repo (well-documented)
7. Explain biggest challenge + how you solved it

**Interview talking points:**
> "I built a full-stack todo application with Angular frontend, Express backend, and MongoDB database. Implemented JWT authentication with interceptors, created reusable components with Signals for state management, and used RxJS for advanced features like debounced search. The app is fully responsive and deployed on Render (backend) and Netlify (frontend)."

---

## File Structure Reference

```
todo-app-backend/
├── models/
│   ├── User.js
│   └── Todo.js
├── routes/
│   ├── auth.js
│   └── todos.js
├── middleware/
│   └── auth.js
├── server.js
├── .env
└── package.json

todo-app-frontend/
├── src/app/
│   ├── components/
│   │   ├── auth/
│   │   │   ├── signup.component.ts
│   │   │   ├── signup.component.html
│   │   │   ├── login.component.ts
│   │   │   └── login.component.html
│   │   ├── todo/
│   │   │   ├── todo-list.component.ts
│   │   │   ├── todo-item.component.ts
│   │   │   ├── add-todo.component.ts
│   │   │   └── edit-todo.component.ts
│   │   ├── navbar.component.ts
│   │   └── dashboard.component.ts
│   ├── services/
│   │   ├── auth.service.ts
│   │   └── todo.service.ts
│   ├── guards/
│   │   └── auth.guard.ts
│   ├── interceptors/
│   │   └── auth.interceptor.ts
│   ├── pipes/
│   │   └── format-date.pipe.ts
│   ├── models/
│   │   └── interfaces.ts
│   ├── app.routes.ts
│   ├── app.config.ts
│   └── app.component.ts
├── styles.css
└── package.json
```

---

## Success Criteria

✅ All features working (auth, CRUD, search, filter, sort)
✅ Code is clean, commented, and organized
✅ Error handling for all scenarios
✅ Responsive on mobile, tablet, desktop
✅ Project on GitHub with professional README
✅ Can explain every line of code
✅ Deployed and accessible online
✅ Ready for portfolio + interviews

---

**Start with Phase 1. Complete one phase at a time. Ask for help when stuck. You'll finish in 9 days with a production-ready app!** 🚀