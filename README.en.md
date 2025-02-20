# Aim Trainer

[中文](./README.md) | English

A web-based FPS game aim training tool designed to help players improve their aiming skills in various FPS games.

## Features

- **Multiple Training Modes**: Including challenge mode, target tracking, moving targets, precision training, and double-shot training
- **Real-time Feedback**: Provides real-time statistics on hit rate, reaction time, and more
- **Customizable Settings**: Adjustable crosshair styles, difficulty levels, and other personalized settings
- **Responsive Design**: Perfect support for various device sizes

## Tech Stack

- React 18
- TypeScript
- Tailwind CSS
- Vite

## Vercel Deployment Guide

### 1. Prerequisites

- Ensure you have a [GitHub](https://github.com) account
- Ensure you have a [Vercel](https://vercel.com) account
- Fork this project to your GitHub repository

### 2. Deployment Steps

1. Log in to the Vercel platform
2. Click the "New Project" button
3. Select the forked project from your GitHub repository list
4. Configure the project:
   - Framework Preset: Select "Vite"
   - Build Command: Change to `pnpm build`
   - Output Directory: Keep default `dist`
5. Click the "Deploy" button

After deployment, Vercel will automatically generate a domain for access. You can also add a custom domain in the project settings.

### 3. Automatic Deployment

Vercel will automatically monitor your GitHub repository changes:
- When there are new commits to the main/master branch, it will automatically trigger redeployment
- Each Pull Request will generate a preview environment

## Local Development

```bash
# Clone the project
git clone [your repository address]

# Install dependencies
pnpm install

# Start development server
pnpm dev
```

## License

MIT License