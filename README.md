# Portfolio CMS

A modern, drag-and-drop portfolio builder built with Next.js, TypeScript, Tailwind CSS, and Supabase.

## Features

- 🎨 **Drag & Drop Editor** - Intuitive visual editor with draggable components
- 🔒 **Authentication** - Secure user authentication with Supabase Auth
- 💾 **Data Persistence** - Save and retrieve portfolios with Supabase database
- 📱 **Responsive Design** - Mobile-friendly interface and portfolio views
- 🚀 **Real-time Updates** - Live portfolio updates and autosave functionality
- 🎯 **Block System** - Text, Image, Button, and Grid components
- 🔄 **Undo/Redo** - Full history management with Zustand
- 🌐 **Public Sharing** - Share portfolios via public URLs
- 🐳 **Docker Support** - Easy deployment with Docker containers

## Tech Stack

- **Frontend**: Next.js 14, TypeScript, Tailwind CSS
- **State Management**: Zustand
- **Drag & Drop**: React DnD
- **Backend**: Supabase (Auth + Database)
- **Database**: PostgreSQL
- **Deployment**: Docker, Vercel
- **Animations**: Framer Motion

## Quick Start

### Prerequisites

- Node.js 18+ installed
- Supabase account (free tier available)
- Git

### 1. Clone the Repository

\`\`\`bash
git clone <your-repo-url>
cd portfolio-cms
\`\`\`

### 2. Install Dependencies

\`\`\`bash
npm install
\`\`\`

### 3. Set Up Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. Get your project URL and anon key from the API settings
3. Run the SQL schema from `init.sql` in your Supabase SQL editor

### 4. Environment Variables

Create a `.env.local` file in the root directory:

\`\`\`env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
\`\`\`

### 5. Run the Development Server

\`\`\`bash
npm run dev
\`\`\`

Open [http://localhost:3000](http://localhost:3000) to see the application.

## Usage Guide

### Getting Started

1. **Sign Up/Login** - Create an account or sign in at `/login`
2. **Access Editor** - Navigate to `/editor` to start building
3. **Add Components** - Drag blocks from the sidebar to the canvas
4. **Edit Content** - Double-click any block to edit its content
5. **Save Portfolio** - Click "Save" to persist your changes
6. **Share** - Get the public URL from your portfolio settings

### Available Blocks

- **Text Block** - Rich text with customizable typography
- **Image Block** - Images with URL input and styling options
- **Button Block** - Interactive buttons with links
- **Grid Block** - Layout grids for organizing content

### Editor Controls

- **Drag & Drop** - Move blocks around the canvas
- **Select** - Click blocks to select and show resize handles
- **Edit** - Double-click blocks to edit content
- **Undo/Redo** - Use Ctrl+Z / Ctrl+Y or toolbar buttons
- **Clear All** - Reset the entire canvas

## Deployment

### Docker Deployment

1. **Build the Docker image:**
\`\`\`bash
docker build -t portfolio-cms .
\`\`\`

2. **Run with Docker Compose:**
\`\`\`bash
docker-compose up -d
\`\`\`

This will start:
- Next.js app on port 3000
- PostgreSQL database on port 5432
- Optional Supabase local instance on port 54321

### Vercel Deployment

1. **Deploy to Vercel:**
\`\`\`bash
npm install -g vercel
vercel
\`\`\`

2. **Set environment variables** in your Vercel dashboard

3. **Connect your Supabase database** using the production URL

## Database Schema

The application uses a simple but flexible schema:

\`\`\`sql
CREATE TABLE portfolios (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL,
    title VARCHAR(255) NOT NULL,
    layout_json JSONB NOT NULL DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
\`\`\`

The `layout_json` field stores the entire portfolio structure as JSON, including all blocks and their properties.

## API Routes

- **POST /api/portfolio/save** - Save portfolio data
- **GET /api/portfolio/save?user_id=xyz** - Get user's portfolios

## Project Structure

\`\`\`
portfolio-cms/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── page.tsx           # Home page
│   │   ├── login/             # Authentication
│   │   ├── editor/            # Portfolio editor
│   │   ├── view/[id]/         # Public portfolio view
│   │   └── api/               # API routes
│   ├── components/            # React components
│   │   └── Editor/            # Editor-specific components
│   │       ├── blocks/        # Block components
│   │       ├── DraggableBlock.tsx
│   │       └── BlockToolbar.tsx
│   ├── lib/                   # Utilities and configuration
│   │   └── supabaseClient.ts  # Supabase setup
│   └── store/                 # State management
│       └── useLayoutStore.ts  # Zustand store
├── public/                    # Static assets
├── Dockerfile                 # Docker configuration
├── docker-compose.yml         # Multi-container setup
├── init.sql                   # Database schema
└── README.md                  # This file
\`\`\`

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Roadmap

- [ ] **Templates** - Pre-built portfolio templates
- [ ] **Themes** - Multiple color schemes and styling options
- [ ] **Export** - Export portfolios as static HTML/PDF
- [ ] **Analytics** - Portfolio view tracking and insights
- [ ] **Custom Domains** - Connect custom domains to portfolios
- [ ] **Collaboration** - Real-time collaborative editing
- [ ] **Media Library** - Built-in image management
- [ ] **SEO Tools** - Meta tags and SEO optimization
- [ ] **Animation Library** - Advanced animations and transitions

## Troubleshooting

### Common Issues

**Database connection errors:**
- Verify your Supabase URL and keys are correct
- Check that RLS policies are properly configured
- Ensure the database schema is properly initialized

**Drag and drop not working:**
- Make sure React DnD dependencies are installed
- Check browser console for JavaScript errors
- Verify the DndProvider is wrapping the editor

**Build failures:**
- Clear `.next` folder and `node_modules`
- Run `npm install` again
- Check TypeScript errors with `npm run type-check`

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For support, email support@portfoliocms.com or join our Discord community.

---

Built with ❤️ using Next.js, TypeScript, and Supabase.
