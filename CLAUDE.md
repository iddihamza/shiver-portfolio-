# Claude Instructions for Awesome Visual Showcase Portfolio

## Project Overview
This is a React TypeScript application built with Vite, shadcn-ui, and Tailwind CSS. It serves as a visual showcase portfolio with authentication, file management, and content organization features using Supabase as the backend.

## Key Technologies
- **Frontend**: React 18 + TypeScript + Vite
- **UI Framework**: shadcn-ui components + Radix UI
- **Styling**: Tailwind CSS + Tailwind Animate
- **Backend**: Supabase (authentication, database, storage)
- **State Management**: React Query (@tanstack/react-query)
- **Routing**: React Router DOM
- **Forms**: React Hook Form + Zod validation
- **Animations**: Framer Motion
- **Search**: Fuse.js for fuzzy search

## Scripts to Run
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run build:dev` - Build in development mode
- `npm run lint` - Run ESLint
- `npm run preview` - Preview production build

## Project Structure
```
src/
├── components/           # Reusable components
│   ├── admin/           # Admin-specific components
│   ├── auth/            # Authentication components
│   ├── navigation/      # Navigation components
│   ├── security/        # Security-related components
│   └── ui/              # shadcn-ui components
├── contexts/            # React contexts
├── data/                # Data utilities and types
├── hooks/               # Custom hooks
├── integrations/        # Third-party integrations
├── lib/                 # Utility libraries
├── pages/               # Page components
└── utils/               # General utilities
```

## Important Files
- `src/integrations/supabase/client.ts` - Supabase client configuration
- `src/contexts/AuthContext.tsx` - Authentication context
- `src/data/types.ts` - TypeScript type definitions
- `supabase/migrations/` - Database migrations

## Code Conventions
- Use TypeScript for all new files
- Follow shadcn-ui patterns for components
- Use Tailwind CSS for styling
- Use React Hook Form + Zod for forms
- Use React Query for data fetching
- Implement proper error boundaries
- Use secure patterns for file uploads and user input

## Authentication
The app uses Supabase Auth with protected routes. Key components:
- `AuthContext.tsx` for auth state management
- `ProtectedRoute.tsx` for route protection
- `LoginForm.tsx` and `SignUpForm.tsx` for authentication forms

## Database
Uses Supabase with SQL migrations in `supabase/migrations/`. Current schema supports:
- User authentication
- File storage and management
- Content organization (stories, chapters, characters, locations)

## Security Notes
- All user inputs should use secure input components
- File uploads should use the SecureFileUpload component
- Implement proper validation using Zod schemas
- Use error boundaries for error handling

## Development Guidelines
1. Always run `npm run lint` before committing
2. Use existing component patterns from the ui/ directory
3. Follow the established folder structure
4. Test authentication flows thoroughly
5. Ensure responsive design with Tailwind breakpoints
6. Use proper TypeScript types from `src/data/types.ts`

## Common Tasks
- **Adding new pages**: Create in `src/pages/` and add routes in main router
- **New components**: Follow shadcn-ui patterns, place in appropriate subdirectory
- **Database changes**: Create new migrations in `supabase/migrations/`
- **New hooks**: Add to `src/hooks/` with proper TypeScript types
- **Authentication**: Use AuthContext and ProtectedRoute wrapper

## Testing
- No specific test framework configured
- Manual testing recommended for authentication flows
- Test file uploads and security components thoroughly