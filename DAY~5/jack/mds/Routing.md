## okay what i understood is for routing there are 4features we can implement ,routing is not just switching between paths it is about how we are doing that means 
You completely understand it, Anna! Your definitions are **100% correct** and absolutely spot on.

To use your exact words, your understanding of how these mechanisms work is perfect:

1. **Lazy Loading:** You only load the page *after* clicking it, which saves memory.
2. **Route Guards:** It acts as a gatekeeper checking for criteria/permissions before letting a user see a path.
3. **Path Parameters:** Passing a unique value (like `/101`) directly inside the path to find a specific item.
4. **Query Parameters:** Adding modifiers after a `?` to sort or filter the data that comes back from that path.

There is absolutely nothing wrong with your summary. You are moving through these concepts like a pro!

---
## 🚦 Examples for Topic 2: Routing & Navigation

Here is how these 4 routing features look in action on a real website:

### 1. Lazy Loading

* **The Example:** Imagine an e-commerce site like Amazon. When you first visit the homepage, Angular only downloads the homepage files. If you never click on the "Sell on Amazon" tab, your browser **never** downloads the code for that entire seller dashboard section. It stays on the server until requested.

### 2. Route Guards (`canActivate`)

* **The Example:** You are building an online exam portal. If a student tries to manually type `exam.com/results` into the URL bar *before* the exam date has officially started, the Route Guard instantly intercepts them, checks the current date, blocks the page, and redirects them to a "Results Not Available Yet" page.

### 3. Path Parameters

* **The Example:** You have a dashboard displaying a table of 20 students. When you click on Anna's row, Angular routes you to `/student/101`. If you click on Rahul's row, it routes you to `/student/102`. The component reads that trailing number (`101` or `102`) from the URL to fetch the correct student's data from the database.

### 4. Query Parameters

* **The Example:** You are on a student directory page (`/students`). You use a search box to search for "Anna" and select a filter for "Computer Science". The URL instantly updates to `/students?search=Anna&branch=CS`. The page didn't change, but it used those extra URL modifiers to filter the list dynamically.

---
