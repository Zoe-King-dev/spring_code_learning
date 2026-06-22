# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Spring Boot source code learning repository containing a knowledge base (in Chinese) for studying Spring Boot internals, based on the book "Spring Boot 源码解读与原理分析". The repository includes:

- **14 chapters** covering Spring Boot's auto-configuration, IOC container, AOP, embedded web containers, JDBC, MyBatis, WebMVC, WebFlux, and application deployment
- **A web-based learning app** (`learning-app/`) for reading the markdown content with features like search, bookmarks, and progress tracking

## Common Commands

```bash
# Serve the learning app locally (runs from repository root)
python -m http.server 8082

# Or run from learning-app directory directly
cd learning-app && python -m http.server 8082

# Access at http://localhost:8082/learning-app/
```

## Repository Structure

```
├── CLAUDE.md                      # This file
├── SpringBoot知识库.md            # Main knowledge base (complete book content)
├── chapters/                      # Individual chapter markdown files
│   ├── 00_前言与目录.md
│   ├── 01_第1章_Spring_Boot整体概述.md
│   ├── 02_第2章_Spring_Boot的自动装配.md
│   └── ... (chapters 03-14)
└── learning-app/                  # Web viewer for the knowledge base
    ├── index.html                 # Main HTML shell
    ├── css/                       # Stylesheets
    └── js/                        # JavaScript modules (config.js, app.js, etc.)
```

## Learning App Architecture

The `learning-app/` is a vanilla JS web application that:
- Renders markdown chapter files using `marked.js`
- Provides syntax highlighting via `highlight.js`
- Uses client-side routing in `js/router.js` for navigation
- Stores user progress/bookmarks in `js/storage.js`
- Supports theme switching (light/dark)

The app expects chapter files to be accessible either from the `chapters/` directory or via a symlink named `learning-app/chapters` pointing to the repository's `chapters/` directory.

## Content Organization

Chapters follow this structure:
- **Part 1** (Ch 1-5): Core container concepts - IOC, AOP, auto-configuration
- **Part 2** (Ch 6-9): Lifecycle analysis - SpringApplication, IOC refresh, embedded Tomcat, AOP lifecycle
- **Part 3** (Ch 10-13): Integration scenarios - JDBC, MyBatis, WebMVC, WebFlux
- **Part 4** (Ch 14): Application deployment and graceful shutdown
