Excellent. 🔥

Now we are entering the document that most developers get wrong. If we design this properly, you won't have to rewrite your backend later.

This is where I stop thinking like a developer and start thinking like a **Software Architect**.

---

# 📘 PORTIVA AI

# Document 5 — System Architecture & Database Design

**Version:** 1.0

**Purpose:** Backend Architecture + MongoDB Design + Scalability

---

# 1. System Architecture

Instead of one large Express application, Portiva AI will be **modular**. We are not building microservices yet, but we will organize the code so it can evolve into them later.

```
                    User
                      │
                      ▼
                Angular Frontend
                      │
                 HTTPS / REST API
                      │
               Express API Gateway
                      │
 ┌───────────────────────────────────────────────┐
 │                 Core Modules                  │
 ├───────────────────────────────────────────────┤
 │ Authentication                               │
 │ User Management                              │
 │ Portfolio Management                         │
 │ AI Engine                                    │
 │ Theme Engine                                 │
 │ Publishing Engine                            │
 │ Media Manager                                │
 │ Blog Manager                                 │
 │ Appointment Manager                          │
 │ Contact Manager                              │
 │ Analytics                                    │
 │ Notification Service                         │
 │ Admin                                        │
 └───────────────────────────────────────────────┘
                      │
               MongoDB Database
                      │
        Object Storage (Cloudinary/S3)
                      │
            AI Provider Abstraction
```

---

# 2. Backend Folder Structure

```
backend/
│
├── src/
│
├── config/
│
├── database/
│
├── middleware/
│
├── shared/
│
├── modules/
│      auth/
│      users/
│      portfolios/
│      ai/
│      themes/
│      media/
│      blogs/
│      appointments/
│      contacts/
│      analytics/
│      notifications/
│      publishing/
│      admin/
│
├── jobs/
│
├── queues/
│
├── utils/
│
├── types/
│
└── server.js
```

---

# 3. Frontend Folder Structure

```
frontend/
│
├── core/
│
├── shared/
│
├── layouts/
│
├── pages/
│
├── features/
│      auth/
│      dashboard/
│      portfolio/
│      ai/
│      editor/
│      analytics/
│      blogs/
│      appointments/
│      settings/
│      admin/
│
├── services/
│
├── models/
│
├── guards/
│
├── interceptors/
│
├── pipes/
│
├── directives/
│
└── assets/
```

---

# 4. MongoDB Collections

Instead of placing everything into one Portfolio document, we'll separate concerns.

Collections:

```
users

profiles

portfolios

portfolioVersions

portfolioThemes

portfolioAssets

portfolioMedia

portfolioBlogs

appointments

contactMessages

notifications

subscriptions

analytics

activityLogs

aiJobs

templates

settings

admins

systemLogs
```

This structure keeps data manageable and scalable.

---

# 5. User Collection

Stores authentication and account information.

Fields:

```
_id

email

passwordHash

provider

isVerified

role

status

createdAt

updatedAt

lastLogin
```

Role:

```
USER

ADMIN

SUPER_ADMIN
```

---

# 6. Profile Collection

Contains personal information.

Fields:

```
userId

fullName

photo

phone

country

city

languages

profession

headline

bio

socialLinks

preferences
```

Keeping profile separate allows reuse across multiple portfolios in the future.

---

# 7. Portfolio Collection

One document per portfolio.

Fields:

```
portfolioId

ownerId

title

slug

currentVersion

status

themeId

visibility

seoId

analyticsId

createdAt

updatedAt
```

Status:

```
Draft

Review

Published

Archived
```

---

# 8. Portfolio Version Collection

This is one of the most important decisions.

Never overwrite published data.

Instead:

```
Portfolio

↓

Version 1

↓

Published

↓

User edits

↓

Version 2

↓

Draft

↓

Republish

↓

Version 2 becomes Live
```

Fields:

```
portfolioId

version

content

theme

status

createdBy

createdAt
```

This allows rollback and safe editing.

---

# 9. Portfolio Content Structure

Instead of many separate collections for sections, store structured JSON inside each version.

Example:

```
hero

about

skills

experience

education

projects

certifications

gallery

blogs

contact

appointments

footer
```

This makes rendering straightforward while versioning preserves history.

---

# 10. Media Collection

Stores uploaded files.

Fields:

```
ownerId

type

originalName

storageKey

mimeType

size

width

height

optimized

uploadedAt
```

Supported:

* Images
* Videos
* PDFs
* Certificates
* Resumes

---

# 11. AI Job Collection

Every AI request becomes a tracked job.

Example:

```
Generate Portfolio

↓

AI Job

↓

Running

↓

Completed
```

Fields:

```
jobId

ownerId

type

status

provider

inputReference

outputReference

tokensUsed (optional)

startedAt

completedAt

error
```

This makes retries and debugging easier.

---

# 12. Analytics Collection

Track:

```
Visitors

Countries

Referrers

Devices

Sessions

Clicks

Downloads

Appointments

Contacts
```

Store aggregated data for dashboards while keeping raw event data lightweight.

---

# 13. Blog Collection

Fields:

```
portfolioId

title

slug

coverImage

content

seo

status

publishedAt
```

---

# 14. Appointment Collection

Fields:

```
portfolioId

visitorName

email

phone

requestedDate

status

notes

createdAt
```

---

# 15. Contact Messages

Fields:

```
portfolioId

name

email

phone

message

read

createdAt
```

---

# 16. Notification Collection

Supports:

```
AI Finished

Appointment

Contact

Blog Published

Subscription

Publishing
```

Each notification has:

```
userId

type

title

message

read

createdAt
```

---

# 17. Subscription Collection

Fields:

```
ownerId

plan

billingCycle

status

startedAt

expiresAt

features
```

Plan examples:

* Free
* Monthly
* Yearly
* Lifetime

---

# 18. Activity Log

Record important actions.

Examples:

```
Portfolio Created

Resume Uploaded

Theme Changed

Published

Republished

AI Rewrite

Blog Generated
```

Useful for support and auditing.

---

# 19. Template Collection

Stores base layouts.

Fields:

```
name

industry

preview

supportedSections

isPremium

version
```

The AI customizes these templates instead of generating every layout from scratch. This balances quality, speed, and cost.

---

# 20. Settings Collection

Stores user preferences.

Examples:

```
Dark Mode

Language

Notification Preferences

AI Preferences

Editor Settings
```

---

# 21. Index Strategy

Plan indexes early.

Examples:

* email (unique)
* slug (unique)
* ownerId
* portfolioId
* status
* createdAt
* publishedAt

These support common queries without full collection scans.

---

# 22. Security Considerations

* JWT access tokens
* Refresh tokens
* Password hashing
* Rate limiting
* Input validation
* Role-based access control
* Secure file uploads
* HTTPS
* Environment variables
* Audit logging

---

# 23. Scalability Strategy

Design for growth:

* Keep modules isolated.
* Store media outside MongoDB.
* Use queues for AI jobs.
* Cache frequently read data later (e.g., Redis).
* Add CDN for static assets.
* Introduce background workers for publishing and image optimization.

This lets the platform grow from hundreds to thousands of users without major architectural changes.

---

# 24. Future Evolution

As traffic increases, modules like AI, Publishing, Notifications, and Analytics can be extracted into independent services because we've already separated their responsibilities.

---

# 📌 Document 5 Status

**Completed**

---

# 🔥 My Architecture Recommendation

There is one important change I'd make compared to many AI website builders.

**Don't let the AI generate raw HTML/CSS for the final portfolio.**

Instead:

1. Store the portfolio as **structured JSON** (sections, content, settings).
2. Build a reusable Angular rendering engine that converts that JSON into the portfolio UI.
3. Let the AI modify the JSON, not the code.

Benefits:

* Faster edits.
* Consistent quality.
* Easier versioning.
* Safer publishing.
* Theme switching without rebuilding the entire site.

This architecture will make Portiva AI much easier to maintain and scale.

---

## 🚀 Next Document

**Document 6 — Backend Architecture & REST API Specification**

This will define:

* Every API endpoint
* Authentication flow
* Request/response formats
* Error handling
* Validation
* Permissions
* Express module structure
* Service layer
* Controller layer
* Middleware
* AI orchestration
* Publishing pipeline

Once Document 6 is complete, you'll have a backend blueprint detailed enough for an AI coding assistant to start implementing module by module.
