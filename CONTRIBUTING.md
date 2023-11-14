# Contributing to UBC-Tennis-Circle-Website
We love your input! We want to make contributing to this project as easy and transparent as possible, whether it's:

- Reporting a bug
- Discussing the current state of the code
- Submitting a fix
- Proposing new features

### Quality Assurance
- We use **Commitizen** for standardized commit messages.

### Coding Standards and Style Guidelines
To maintain a high standard of code quality and readability, we adhere to the following guidelines:
- **Proper Casing**: Follow naming conventions for code elements.
  - Variables and Helper Functions: `camelCase`
  - Components: `UpperCamelCase`
  - Types & Interfaces: `UpperCamelCase`
  - Constants: `UPPER_SNAKE_CASE`
  - NextJS 13 API endpoints: `UPPER_SNAKE_CASE` (e.g., `POST`, `GET`)
- **Comments**: Mandatory for every helper and utility function.
- **DRY Principle**: Avoid duplicating code and types to ensure consistency and reduce redundancy.

### File System Structure
Our project is organized as follows:
- `app/`
- `pages/` - NextJS pages and layouts
- `api/` - NextJS routes
- `emails/` - Email templates
- `helpers/` - Server-side helper functions
- `broadcasts/` - Broadcast channels
- `components/` - Frontend components
- `contexts/` - Custom React context definitions
- `hooks/` - Custom React hook definitions
- `lib/` - Package-specific setup files (e.g., `mongoose.ts`)
- `logs/` - Server logs
- `models/` - MongoDB models
- `providers/` - Frontend providers/wrappers (e.g., ChakraUI wrapper)
- `types/` - Types used in multiple places
- `utils/` - Frontend utility functions

### Committing to the Project
1. **Issue Assignment**:
   - Link the issue to the project (if not already linked).
   - Change the issue status from “Todo” to “In Progress”.

2. **Branch Creation**:
   - Create a branch on your local machine for the feature or fix.

3. **Coding and Committing**:
   - Develop the assigned feature or fix on your branch.
   - Include the issue number in each commit message (e.g., `feat(components/navbar): Created navbar component #3`).
   - Specify what directory the changes are in, if possible.
   - If a commit affects multiple directories significantly, consider splitting it into multiple commits.

4. **Pull Requests**:
   - Once completed, create a pull request to merge your branch into the main branch.
   - Assign `elliotsaha` as the reviewer for the pull request.
   - After review, it will either be approved or there will be provided feedback for revisions.

### Collaboration and Communication
We value open communication and collaboration. If you have any questions, suggestions, or need assistance with any part of the project, please feel free to reach out.
