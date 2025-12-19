# Learning Management System - Frontend

A modern, feature-rich Learning Management System built with React, TypeScript, and Material-UI. This platform enables users to discover, purchase, and access educational courses with an intuitive and responsive interface.

## 🚀 Features

- **Authentication System**

  - Email and Password login
  - Google OAuth2 integration
  - Password reset functionality
  - Secure session management

- **User Profile Management**

  - Personal profile page
  - Edit user information
  - View purchase history

- **Course Management**

  - Browse available courses
  - Purchase courses via Stripe integration
  - Access purchased courses
  - My Courses dashboard

- **Learning Experience**

  - Module-based course structure
  - Video playback with React Player
  - Progress tracking
  - Responsive video player

- **Communication**
  - Email notifications
  - SMS service integration
  - Real-time updates

## 🛠️ Tech Stack

### Core Technologies

- **React 19.1.1** - UI library
- **TypeScript 5.8.3** - Type-safe JavaScript
- **Vite 7.1.2** - Fast build tool and dev server

### UI Framework & Styling

- **Material-UI (MUI) 7.3.2** - Component library
- **Emotion** - CSS-in-JS styling
- **Framer Motion 12.23.13** - Animation library
- **Lucide React 0.544.0** - Icon library

### State Management & Forms

- **Redux Toolkit 2.9.0** - Global state management
- **React Redux 9.2.0** - React bindings for Redux
- **React Hook Form 7.63.0** - Form validation and handling

### Routing & Navigation

- **React Router DOM 7.9.1** - Client-side routing

### API & Payment Integration

- **Axios 1.12.2** - HTTP client
- **Stripe React** - Payment processing
- **Stripe JS 8.0.0** - Stripe SDK

### Media & Utilities

- **React Player 3.3.3** - Video player component
- **Day.js 1.11.18** - Date manipulation
- **MUI Tel Input 9.0.1** - Phone number input component

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18.0.0 or higher recommended)
- **npm** (v9.0.0 or higher) or **yarn** (v1.22.0 or higher)
- A code editor (VS Code recommended)

## 🔧 Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd vite-project
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

   or

   ```bash
   yarn install
   ```

3. **Set up environment variables**

   Create a `.env` file in the root directory:

   ```env
   # API Configuration
   VITE_API_BASE_URL=http://localhost:5000/api

   # Google OAuth
   VITE_GOOGLE_CLIENT_ID=your_google_client_id

   # Stripe Configuration
   VITE_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key

   # Other configurations
   VITE_APP_NAME=Learning Management System
   ```

4. **Start the development server**

   ```bash
   npm run dev
   ```

   The application will be available at `http://localhost:5173`

## 📜 Available Scripts

### Development

```bash
npm run dev
```

Starts the development server with hot module replacement (HMR).

### Build

```bash
npm run build
```

Compiles TypeScript and builds the production-ready application in the `dist` folder.

### Lint

```bash
npm run lint
```

Runs ESLint to check for code quality issues and enforce coding standards.

### Preview

```bash
npm run preview
```

Previews the production build locally before deployment.

## 📁 Project Structure

```
src/
├── components/ # Reusable UI components
├── configs/ # App Related ENV Variables
├── contexts/ # Context-API for Static Data Use Cases i.e Cart, Theme, Last Purchase.
├── layouts/ # Root layout using react-router Outlet
├── pages/ # Route-based pages
├── store/ # redux-store for slices, reducers, middlewares, auth etc.
├── services/ # API & integrations
├── hooks/ # Custom hooks
├── appRouting/ # App routing
├── utils/ # Helper utilities
└── main.tsx # App entry point
```

## 🔑 Key Dependencies Explained

### State Management

- **@reduxjs/toolkit** - Simplified Redux setup with built-in best practices
- **react-redux** - Official React bindings for Redux store

### UI Components

- **@mui/material** - Comprehensive React component library following Material Design
- **@mui/icons-material** - Material Design icon set
- **@emotion/react** & **@emotion/styled** - Styling solution for MUI

### Forms & Validation

- **react-hook-form** - Performant form library with easy validation
- **mui-tel-input** - International phone number input with validation

### Payment Processing

- **@stripe/react-stripe-js** - React components for Stripe integration
- **@stripe/stripe-js** - Stripe JavaScript SDK for secure payments

### Video & Media

- **react-player** - Universal video player supporting multiple sources (YouTube, Vimeo, etc.)

### Routing

- **react-router-dom** - Declarative routing for React applications

### HTTP Requests

- **axios** - Promise-based HTTP client for API communication

### Animations

- **framer-motion** - Production-ready motion library for React

### Utilities

- **dayjs** - Lightweight date manipulation library
- **lucide-react** - Beautiful, customizable icon library

## 🌐 Environment Variables Reference

| Variable                      | Description            | Required |
| ----------------------------- | ---------------------- | -------- |
| `VITE_API_BASE_URL`           | Backend API base URL   | Yes      |
| `VITE_GOOGLE_CLIENT_ID`       | Google OAuth client ID | Yes      |
| `VITE_STRIPE_PUBLISHABLE_KEY` | Stripe publishable key | Yes      |
| `VITE_APP_NAME`               | Application name       | No       |

## 🎨 Features Implementation

### Authentication Flow

The application implements a complete authentication system with:

- Email/password login with validation
- Google OAuth 2.0 integration
- JWT token management
- Protected routes
- Password reset via email

### Course Purchase Flow

1. User browses available courses
2. Clicks purchase on desired course
3. Redirected to Stripe checkout
4. Payment processed securely
5. Course added to user's library
6. Confirmation email sent

### Video Learning Experience

- Module-based course structure
- Seamless video playback
- Progress tracking
- Resume from last position
- Multiple video format support

## 🚀 Deployment

### Build for Production

```bash
npm run build
```

The optimized production build will be in the `dist` folder, ready for deployment.

### Deployment Platforms

This application can be deployed to:

- **Vercel**

### Example: Deploy to Vercel

```bash
npm install -g vercel
vercel
```

## 🧪 Code Quality

### Linting

The project uses ESLint with TypeScript support for code quality:

```bash
npm run lint
```

### TypeScript

TypeScript provides type safety and better developer experience. Configuration is in `tsconfig.json`.

## 🔒 Security Considerations

- Environment variables are used for sensitive data
- Stripe handles payment processing (PCI compliant)
- JWT tokens for authentication
- Password reset uses secure token generation
- HTTPS required in production

## 📱 Responsive Design

The application is fully responsive and works seamlessly across:

- Desktop (1920px and above)
- Laptop (1024px - 1919px)
- Tablet (768px - 1023px)
- Mobile (320px - 767px)

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 Code Style Guidelines

- Use functional components with hooks
- Follow React best practices
- Use TypeScript for type safety
- Component names should be PascalCase
- Use meaningful variable names
- Add comments for complex logic
- Keep components small and focused

## 🐛 Known Issues

- None currently reported

## 🗺️ Roadmap

- [ ] Course ratings and reviews
- [ ] Discussion forums
- [ ] Live classes integration
- [ ] Mobile app (React Native)
- [ ] Offline course downloads
- [ ] Certificates generation

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👥 Support

For support, email vinaychoudhary994@gmail.com

## 🙏 Acknowledgments

- Material-UI team for the amazing component library
- React team for the excellent framework
- Vite team for the blazing fast build tool
- All contributors who helped build this platform

---

**Built with ❤️ using React, TypeScript, and Material-UI**
