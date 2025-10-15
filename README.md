# Daphnie's Invoicing app

This repository contains the guidelines for the frontend interview question, as well as a repository skeleton with which to start.

Invoice Editor App

This project is a React-based invoice management prototype built as part of a frontend assessment. It demonstrates my approach to structuring, developing, and reasoning through a real-world web application with clean architecture, maintainable code, and focus on user experience.

## Project Overview

The goal of this project was to create a simple yet functional invoice editor that interacts with a REST API.
It allows users to:

View a list of existing invoices with key details

Create new invoices

Manage existing invoices

Finalize invoices

Delete invoices

Fetch customers and products

The focus was not on creating a visually rich interface, but on building a solid, scalable foundation for future development and showing a product mindset.

## My Approach & Reasoning

The app is built with attention to:

Code quality: Clean, modular React components and proper folder organization

Maintainability: Readable, type-safe code using TypeScript

Scalability: Architecture that can easily evolve into a full-featured invoicing system

User experience: Simple and intuitive invoice management flow

⚠️ Note: I was not allowed to add new dependencies to this project.
Otherwise, I would have handled API data fetching and caching with SWR or React Query for cleaner data management, automatic revalidation, and improved developer experience.

## Potential Improvements

While working on this project, I identified several enhancements that could improve the product if it were developed further:

Sorting: Data should be sorted by keys like deadlines and there was no provision for that.

Offline mode with caching	Increases reliability during unstable network conditions	Use service workers or IndexedDB

Advanced form validation	Prevents data entry errors and improves UX	Integrate Zod or Yup for schema validation




## Tech Stack

React (Create React App base)

TypeScript for static typing and maintainability

Axios + React Context for API integration

Tailwind CSS for styling

Jest / React Testing Library for component testing

🌐 Deployment

The app can be deployed easily using any platform such as Vercel, Netlify, or Cloudflare Pages.

Example steps for deployment:

yarn build
# then upload the /build folder to your chosen platform

🧩 Running Locally

To run the project locally:


## Install dependencies
```
yarn install
```

### Start development server
```
yarn start
```

### Build for production
```
yarn build
```

## Summary

This project showcases my ability to:

Build scalable front-end architecture with React and TypeScript

Integrate with REST APIs while maintaining code cleanliness

Think critically about product scalability and technical improvements

Even though it’s a small prototype, it reflects how I approach building production-quality applications — with clarity, foresight, and attention to detail.