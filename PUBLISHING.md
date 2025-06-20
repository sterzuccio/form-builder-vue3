# Publishing Guide for form-builder-vue3

This guide will walk you through the process of pushing your code to GitHub and publishing your package to npm.

## Pushing to GitHub

1. **Initialize Git Repository** (if not already done)
   ```bash
   git init
   ```

2. **Add Remote Repository**
   ```bash
   git remote add origin https://github.com/sterzuccio/form-builder-vue3.git
   ```

3. **Add All Files to Git**
   ```bash
   git add .
   ```

4. **Commit the Files**
   ```bash
   git commit -m "Initial commit"
   ```

5. **Push to GitHub**
   ```bash
   git push -u origin main
   ```
   Note: If your default branch is named "master" instead of "main", use:
   ```bash
   git push -u origin master
   ```

## Publishing to npm

1. **Ensure You Have an npm Account**
   If you don't have an npm account, create one at [npmjs.com](https://www.npmjs.com/signup).

2. **Login to npm from Command Line**
   ```bash
   npm login
   ```
   Enter your username, password, and email when prompted.

3. **Build the Library**
   ```bash
   npm run build:lib
   ```
   This will create the distribution files in the `dist` directory.

4. **Publish the Package**
   ```bash
   npm publish
   ```
   If this is your first time publishing this package, it should succeed. If the package name is already taken, you'll need to choose a different name in your package.json file.

5. **Verify Publication**
   After publishing, you can verify that your package is available on npm by visiting:
   ```
   https://www.npmjs.com/package/form-builder-vue3
   ```

## Publishing Updates

When you want to publish an update to your package:

1. **Update the Version Number**
   In package.json, increment the version number according to [semantic versioning](https://semver.org/) principles:
   - Patch version (0.1.0 -> 0.1.1) for backwards-compatible bug fixes
   - Minor version (0.1.0 -> 0.2.0) for backwards-compatible new features
   - Major version (0.1.0 -> 1.0.0) for breaking changes

   ```bash
   npm version patch  # or minor, or major
   ```

2. **Build and Publish**
   ```bash
   npm run build:lib
   npm publish
   ```

3. **Push Changes to GitHub**
   ```bash
   git push
   git push --tags  # If you used npm version to update the version
   ```

## Publishing a Scoped Package

If you want to publish your package under your npm username (e.g., @sterzuccio/form-builder-vue3):

1. **Update package.json**
   ```json
   {
     "name": "@sterzuccio/form-builder-vue3",
     ...
   }
   ```

2. **Publish as Public Package**
   By default, scoped packages are private on npm. To publish as a public package:
   ```bash
   npm publish --access public
   ```

## Troubleshooting

- **"You need to be logged in to publish packages"**: Run `npm login` again.
- **"Package name already exists"**: Choose a different name in package.json.
- **"No auth token"**: Your npm authentication has expired. Run `npm login` again.
- **"Version already exists"**: Update the version number in package.json.