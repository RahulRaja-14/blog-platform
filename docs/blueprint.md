# **App Name**: PlatformStream

## Core Features:

- User Authentication & Authorization: Secure user registration and login with password hashing (bcrypt) and JWTs. Implements guarded routes to protect private dashboard content and blog management actions.
- Blog Creation & Management: Authenticated users can create, edit, and delete their own blog posts via a private dashboard. Posts include title, content, slug, and publish status with proper validation and access control.
- Public Blog Viewing: View individual blog posts on public URLs (e.g., /public/blogs/:slug). Only published posts are accessible, with appropriate 404 handling for non-existent or unpublished content.
- Public Blog Feed: Displays a paginated, real-time public feed of all published blogs. Each entry shows basic author information, like count, comment count, and publish date, sorted by newest first.
- Liking System: Authenticated users can like or unlike a blog post once. The system updates the like count dynamically and prevents duplicate likes with a database constraint.
- Commenting System: Authenticated users can add new comments to blog posts. Comments are displayed in real-time, sorted by newest first, and include author information.
- AI-Powered Content Summary Tool: Upon publishing a blog, an AI tool automatically generates and stores a concise summary, improving content discoverability without manual input. This process runs asynchronously to avoid blocking user interactions.

## Style Guidelines:

- Primary brand color: a rich, professional blue (#2962FF) to evoke trust and clarity, making key actions and branding elements stand out on lighter backgrounds.
- Background color: an extremely light, desaturated blue-grey (#F0F4FA) that complements the primary color while maintaining a clean, spacious feel, ideal for a professional content platform.
- Accent color: a vibrant, striking aqua (#14DAED) used for calls-to-action, highlights, and interactive elements to provide visual emphasis and user guidance.
- Headline and body font: 'Inter' (sans-serif) for its modern, highly legible, and objective aesthetic, ensuring clear communication and a clean interface across all text elements.
- Clean, system-style vector icons (e.g., outlined or filled without excessive detail) for consistent visual language and intuitive user navigation across the platform.
- Responsive, grid-based layouts prioritizing readability and content hierarchy, ensuring a clear separation of elements and optimal viewing across various device sizes.
- Subtle, smooth UI transitions and micro-interactions for feedback on user actions (e.g., loading states, button clicks) enhancing the perceived quality and responsiveness of the application.