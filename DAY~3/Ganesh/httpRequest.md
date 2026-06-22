# Connecting to APIs in Angular

Angular uses a built-in service called **`HttpClient`** to communicate with remote servers over HTTP. This service is based on **RxJS Observables**, meaning it handles asynchronous data streams efficiently.

---

## 1. Setup and Configuration

Before making API calls, you must provide and configure the `HttpClient` in your application.

### Step 1: Provide `HttpClient`
In modern Angular applications (v15+), configure the client in your `app.config.ts` file using `provideHttpClient()`.

```typescript
// app.config.ts
import { ApplicationConfig } from '@angular/core';
import { provideHttpClient } from '@angular/common/http';

export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient()
  ]
};
```

---

## 2. Best Practice: Create an API Service

Always isolate your API logic inside a reusable service instead of writing it directly in your components.

### Step 2: Generate and Write the Service
Run the command `ng generate service data` to create a service, then implement your HTTP requests.

```typescript
// data.service.ts
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

// Define an interface to enforce type safety for your API data
export interface Post {
  id: number;
  title: string;
  body: string;
}

@Injectable({
  providedIn: 'root'
})
export class DataService {
  // Use inject() to bring in the HttpClient
  private http = inject(HttpClient); 
  private apiUrl = 'https://typicode.com';

  // GET request to fetch data
  getPosts(): Observable<Post[]> {
    return this.http.get<Post[]>(this.apiUrl);
  }

  // POST request to send data
  createPost(newPost: Partial<Post>): Observable<Post> {
    return this.http.post<Post>(this.apiUrl, newPost);
  }
}
```

---

## 3. Consume the Service in a Component

To display the data, inject your service into a component and handle the subscription life cycle.

### Step 3: Update the Component TypeScript File

```typescript
// post-list.component.ts
import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataService, Post } from './data.service';

@Component({
  selector: 'app-post-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './post-list.component.html'
})
export class PostListComponent implements OnInit {
  private dataService = inject(DataService);
  
  // Array to hold the API result
  posts: Post[] = [];
  errorMessage: string = '';

  ngOnInit(): void {
    // Subscribe to the observable to trigger the API call
    this.dataService.getPosts().subscribe({
      next: (data) => {
        this.posts = data;
      },
      error: (err) => {
        this.errorMessage = 'Failed to load posts';
        console.error(err);
      }
    });
  }
}
```

### Step 4: Render the Data in the HTML Template

```html
<!-- post-list.component.html -->
<div *ngIf="errorMessage">{{ errorMessage }}</div>

<ul *ngIf="posts.length > 0">
  <li *ngIf="let post of posts">
    <h3>{{ post.title }}</h3>
    <p>{{ post.body }}</p>
  </li>
</ul>
```

---

## How It Works Behind the Scenes

1. **The Observable Blueprint**: Calling `this.http.get()` does not immediately send a network request. It returns an RxJS `Observable`, which acts as a blueprint for the request.
2. **The Subscription Trigger**: The network request is only fired when a component explicitly calls `.subscribe()`. 
3. **Automatic JSON Parsing**: Angular automatically converts the raw JSON response text from the server into a JavaScript object/array.
4. **Unsubscription**: Angular's `HttpClient` automatically completes the observable stream after the response arrives, safely preventing memory leaks.

