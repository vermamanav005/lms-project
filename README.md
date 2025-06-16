# LMS Project (Frontend)

LatteLabs a desktop Learning Management System (LMS) built with React, Vite, and Tailwind CSS. It supports role-based dashboards for Admin, Teacher, and Student users, with features like user management, course enrollment, and protected routes.

## Screenshot

Home page
![Home page](<Screenshot 2025-06-16 at 11.32.35 AM.jpg>)screenshots/Screenshot 2025-06-16 at 11.32.35 AM.jpg

Login



## Features

- **Role-Based Dashboards**:
  - **Admin**: Manage users and courses (`/dashboard`, `/users`, `/courses`).
  - **Teacher**: Manage courses and students (`/dashboard`, `/courses`, `/students`).
  - **Student**: View enrolled courses and quizzes (`/dashboard`, `/enrolled-courses`, `/quizzes`).
- **Authentication**: Login (`/login`) and signup (`/signup`) with role selection (Admin, Teacher, Student).
- **Protected Routes**: Role-based access control using React Router.
- **UI**: Fixed navbar (`bg-blue-600`), hover-expandable sidebar (64px to 256px), and content area (`max-w-7xl`).
- **Enrolled Courses**: Students can view enrolled courses with mock data (to be replaced with backend API).
- **Styling**: Tailwind CSS with Heroicons for icons.

## Tech Stack

- **React**: ^18.2.0
- **Vite**: ^5.4.8
- **React Router**: ^6.26.2
- **Tailwind CSS**: ^3.4.14
- **Heroicons**: ^2.1.5
- **Axios**: For API requests to backend

## Prerequisites

- **Node.js**: >= 18
- **npm**: >= 8

## Setup Instructions

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/vermamanav005/lms-project.git
   cd lms-project
   npm install
   npm run dev