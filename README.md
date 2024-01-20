# 🛣️ 🏔️ Dev Road

https://monroecc.dev/

A Learning Management System for MCC Frontend Developer Professional Certification.

## ▶️ Getting Started

clone the repo

```
cd dev-road
pnpm
pnpm dev
```

## 📚 LMS Content 
This LMS is a guided educational resource for students enrolled in the Monroe Community College Professional Developer Certification Course.

Create an account to gain access to the learning resources:

- Lecture Slides
- Course Timeline
- Curated Resources and Web Assets
- A student community on discord to ask & answer questions
- Homework Excercizes
- Quiz Challenges
- Guided Code Along Workshops
- Portfolio Projects
- Career Skills and Tips
- Coding Problem Solutions
- Recommended Job Boards
- External Course Videos
- More Courses!

## 🚧 Project Structure

Inside this project, you'll see the following folders and files:

```text
├── public/
├── src/
│   ├── components/
│   ├── content/
│   ├── layouts/
│   └── pages/
├── astro.config.mjs
├── README.md
├── package.json
└── tsconfig.json
```

Astro looks for `.astro` or `.md` files in the `src/pages/` directory. Each page is exposed as a route based on its file name.

There's nothing special about `src/components/`, but that's where we like to put any Astro/React/Vue/Svelte/Preact components.

The `src/content/` directory contains "collections" of related Markdown and MDX documents. Use `getCollection()` to retrieve posts from `src/content/blog/`, and type-check your frontmatter using an optional schema. See [Astro's Content Collections docs](https://docs.astro.build/en/guides/content-collections/) to learn more.

Any static assets, like images, can be placed in the `public/` directory.

## 🧞 Commands

All commands are run from the root of the project, from a terminal:

| Command                    | Action                                           |
| :------------------------- | :----------------------------------------------- |
| `pnpm install`             | Installs dependencies                            |
| `pnpm run dev`             | Starts local dev server at `localhost:4321`      |
| `pnpm run build`           | Build your production site to `./dist/`          |
| `pnpm run preview`         | Preview your build locally, before deploying     |
| `pnpm run astro ...`       | Run CLI commands like `astro add`, `astro check` |
| `pnpm run astro -- --help` | Get help using the Astro CLI                     |

## 🚀 Deployment

Deployed to Cloudflare pages (SSR) with cloudlfare adaptor & `directory` function page configuration.