# 🚀 ProjectX — Get Ideas From Experience

> *Where builders unite. Share your project, spark the next.*

A collaborative platform where developers and creators share their projects to inspire others and foster innovation across domains like AI/ML, IoT, and Web Development.

🔗 **[Live Demo](https://project-x-get-ideas-from-experience.vercel.app/)**

---

## Features

- **Browse Projects** — Discover projects across categories like AI/ML, IoT, and Web
- **Submit Your Project** — Share your work with a rich markdown editor
- **User Profiles** — Authenticated user accounts with personal project listings
- **Search & Filter** — Find projects by keyword or category
- **Sanity Studio** — Built-in CMS dashboard for content management
- **Smooth UI** — 3D card effects, background animations, and responsive design

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 15, React 19, TypeScript |
| Styling | Tailwind CSS, Radix UI, Lucide React |
| CMS | Sanity (headless) |
| Auth | NextAuth v5 |
| Animations | Motion, Three.js, React Three Fiber |
| Editor | EasyMDE / React SimpleMDE |
| Deployment | Vercel + GitHub CI/CD |

---

## Getting Started

### Prerequisites
- Node.js 18+
- Sanity account
- GitHub OAuth app (for authentication)

### Installation

```bash
# Clone the repository
git clone https://github.com/JAIVARDHAN1402/ProjectX---Get-Ideas-From-Experience.git
cd ProjectX---Get-Ideas-From-Experience

# Install dependencies
npm install
```

### Environment Variables

Create a `.env.local` file in the root:

```env
NEXT_PUBLIC_SANITY_PROJECT_ID=your_sanity_project_id
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_WRITE_TOKEN=your_sanity_write_token

AUTH_SECRET=your_auth_secret
AUTH_GITHUB_ID=your_github_oauth_client_id
AUTH_GITHUB_SECRET=your_github_oauth_client_secret
```

### Run Locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

To access the Sanity Studio, go to [http://localhost:3000/studio](http://localhost:3000/studio).

---

## Project Structure

```
ProjectX/
├── app/
│   ├── api/auth/          # NextAuth authentication
│   ├── studio/            # Sanity CMS Studio
│   └── (root)/            # Main app pages
├── components/
│   ├── ui/                # 3D cards, animations, buttons
│   ├── ProjectCard.tsx
│   ├── ProjectForm.tsx
│   ├── SearchForm.tsx
│   └── NavbarMenuStrip.tsx
├── sanity/
│   ├── schemaTypes/       # Project & User schemas
│   └── sanity.config.ts
└── lib/
    ├── action.ts
    ├── utils.ts
    └── validation.ts
```

---

## Scripts

```bash
npm run dev        # Start development server
npm run build      # Production build
npm run lint       # Run ESLint
npm run typegen    # Generate Sanity TypeScript types
```

---

## Deployment

Deployed on **Vercel** with automatic deployments on every push to `main`. Sanity content is managed via the hosted Studio at `/studio`.

---

## License

This project is open source and available under the [MIT License](LICENSE).
