# Дошка оголошень (Announcement Board)

A simple and minimalist announcement board application built with Node.js, Express, and Prisma.

## 🛠️ Technologies Used

- **Backend**: [Express.js](https://expressjs.com/) v5.2.1
- **Database**: SQLite with [Prisma ORM](https://www.prisma.io/)
- **Template Engine**: [EJS](https://ejs.co/)
- **Database Driver**: Better SQLite3 (Prisma adapter)
- **Runtime**: Node.js with ES modules

### Key Dependencies

- `express` - Web framework
- `@prisma/client` - Database client
- `@prisma/adapter-better-sqlite3` - SQLite adapter for Prisma
- `ejs` - Templating engine
- `dotenv` - Environment variable management

## 📁 Project Structure

```
announcement-board/
├── app.js                      # Main application file with all routes
├── db.js                       # Prisma client initialization
├── package.json               # Project dependencies
├── prisma.config.ts          # Prisma configuration
├── public/
│   └── styles.css            # Minimalist styling with responsive design
├── views/                    # EJS templates
│   ├── index.ejs             # Announcements list with search & pagination
│   ├── new.ejs               # Form to create new announcement
│   ├── announcement.ejs       # Single announcement details page
│   ├── error.ejs             # 500 error page
│   └── 404.ejs               # 404 not found page
├── prisma/
│   ├── schema.prisma         # Database schema definition
│   └── migrations/           # Database migration history
└── generated/
    └── prisma/              # Generated Prisma types
```

## 🚀 Quick Start

### Prerequisites

- Node.js 16+ installed
- npm or yarn package manager

### Installation

1. **Clone and navigate to project**

   ```bash
   git clone <repository-url>
   cd announcement-board
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up database**

   ```bash
   npx prisma migrate dev
   ```

   This will create SQLite database and run migrations.

4. **Start the server**

   ```bash
   node app.js
   ```

5. **Open in browser**
   ```
   http://localhost:3000
   ```

## 📋 Features

- **List Announcements** - View all announcements with pagination (10 per page)
- **Search** - Search announcements by title
- **Sort** - Sort by newest or oldest
- **Categories** - 4 categories with emoji badges:
  - 📦 Продаж (Sale)
  - 🔧 Послуги (Services)
  - 💼 Робота (Jobs)
  - 📌 Інше (Other)
- **Create** - Post new announcements with validation
- **View Details** - See full announcement information
- **Delete** - Remove announcements
- **Responsive Design** - Mobile-friendly interface

## 🔌 API Endpoints

### GET `/`

**List all announcements with search and pagination**

Query parameters:

- `search` (optional) - Search by announcement title
- `sort` (optional) - Sort order: `newest` (default) or `oldest`
- `page` (optional) - Page number (default: 1)

Example:

```
GET /?search=iPhone&sort=newest&page=1
```

Response: Renders `index.ejs` with announcements list

---

### GET `/announcements`

**Show form to create new announcement**

Response: Renders `new.ejs` with empty form

---

### POST `/announcements`

**Create new announcement**

Form data (application/x-www-form-urlencoded):

- `title` (string, 5-100 chars) - Announcement title **required**
- `description` (string, 10+ chars) - Detailed description **required**
- `price` (number, > 0) - Price in UAH **required**
- `category` (enum) - One of: `sale`, `service`, `job`, `other` **required**
- `contactInfo` (string, 5+ chars) - Email or phone **required**

Response:

- `303` - Redirect to home page on success
- `200` - Re-render form with validation errors on failure

---

### GET `/announcements/:id`

**Get single announcement details**

Parameters:

- `id` (integer) - Announcement ID

Response:

- `200` - Renders `announcement.ejs` with full details
- `404` - If announcement not found

---

### DELETE `/announcements/:id`

**Delete announcement**

Parameters:

- `id` (integer) - Announcement ID

Response:

- `204` - No Content (successful deletion)

---

## 🎨 Styling

The application includes minimalist but stylish CSS with:

- Centered container layout (max-width: 1200px)
- Responsive grid for announcement cards
- Category-based color borders
- Form styling with validation feedback
- Mobile-responsive design (breakpoint at 768px)
- Clean typography and spacing

## 📝 Database Schema

**Announcement Model**

```prisma
model Announcement {
  id          Int     @id @default(autoincrement())
  title       String
  description String
  price       Float
  category    String
  contactInfo String
  createdAt   DateTime @default(now())
}
```

## 🚨 Error Handling

- **404 Page** - Displayed for invalid routes or missing announcements
- **500 Error Page** - Shown when server errors occur
- **Form Validation** - Client-side HTML5 + server-side validation with error messages

## 📱 Browser Support

Works on all modern browsers including mobile devices with responsive CSS.

---

**Language**: Ukrainian (UI) | **Status**: Development
