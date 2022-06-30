# Conventions

This document states the conventions that we will work with on this codebase. This is a living document and is not meant to be complete. As we keep deciding on conventions and as we decide to modify them, we will keep this documentation up to date.

## Base

Our conventions are based on these initial documentation. Anything not explicitly defined here is meant to follow these base conventions.

- [git conventions](https://github.com/MakingSense/development-guidelines/blob/master/git-workflow/conventions.md)
- [JavaScript Style Guide](https://github.com/MakingSense/code-style-guides/tree/master/Javascript(ES6))

## Components

### Index files

Index components should not have logic of their own. Instead, they should be just import/export operations that expose the behavior of the "package" (folder) where they are located.

Example: (`/src/views/Login/index.ts`)

```typescript
export { default as Login } from './Login';
```

## Assets

### Images
We will put the images that we need for each component in `./src/assets`. If the image is a little bit general speaking, for example, an arrow used as an icon, in that case, we recommend to put that image on the folder `./src/assets/shared`, if not, just create a folder (inside src/assets) for the purpose/feature that you are doing.

The **name** of the image will always be in camelCase format and we would love to see svg images instead of png, jpg, and others.