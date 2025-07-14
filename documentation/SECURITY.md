# Security Updates

This document outlines security updates made to the project and provides guidance on handling remaining vulnerabilities, compatibility warnings, and deprecated packages.

## Recent Security Updates

The following security vulnerabilities have been addressed:

1. **axios**: Updated from ^0.27.2 to ^1.10.0
   - Fixed high severity CSRF vulnerability (https://github.com/advisories/GHSA-wf5p-g6vw-rhxx)
   - Fixed high severity SSRF vulnerability (https://github.com/advisories/GHSA-jr5f-v2jv-69x6)
   - **Note**: This is a major version update and may include breaking changes. Please review the [axios changelog](https://github.com/axios/axios/blob/master/CHANGELOG.md) for details.

2. **postcss**: Updated from ^8.4.14 to ^8.4.31
   - Fixed moderate severity line return parsing error (https://github.com/advisories/GHSA-7fh5-64p2-3v2j)
   - This is a minor update and should not include breaking changes.

## Remaining Vulnerabilities

There are still some vulnerabilities in transitive dependencies that require attention:

1. **cross-spawn < 6.0.6**: High severity ReDoS vulnerability (https://github.com/advisories/GHSA-3xgq-45jj-v275)
   - This is a dependency of the Vue CLI plugins.

2. **webpack-dev-server <= 5.2.0**: Moderate severity source code theft vulnerabilities
   - https://github.com/advisories/GHSA-9jgg-88mc-972h
   - https://github.com/advisories/GHSA-4v9v-hfq4-rm2v
   - This is a dependency of the Vue CLI service.

## How to Fix Remaining Vulnerabilities

A script has been added to the package.json file to fix these remaining vulnerabilities:

```bash
npm run fix-vulnerabilities
```

This script runs `npm audit fix --force`, which will update the dependencies to secure versions. However, this may include breaking changes, so it's recommended to:

1. Backup your project before running this script
2. Test your application thoroughly after running the script
3. Review the changes made to ensure they don't break your application

## Manual Verification

You can manually verify the security status of your dependencies by running:

```bash
npm audit
```

This will show any remaining vulnerabilities in your project.

## Keeping Dependencies Secure

It's recommended to regularly update your dependencies to keep them secure:

```bash
npm update
npm audit
```

For major version updates that may include breaking changes, it's best to review the changelogs and test your application thoroughly before deploying to production.

## Node.js Compatibility

This project has been configured to work with Node.js versions 14.0.0 through 22.x.x. Using Node.js v23.0.0 or higher may result in compatibility warnings or errors with some dependencies.

If you're using Node.js v23+, you may see warnings like:

```
npm warn EBADENGINE Unsupported engine {
npm warn EBADENGINE   package: '@achrinza/node-ipc@9.2.9',
npm warn EBADENGINE   required: {
npm warn EBADENGINE     node: '8 || 9 || 10 || 11 || 12 || 13 || 14 || 15 || 16 || 17 || 18 || 19 || 20 || 21 || 22'
npm warn EBADENGINE   },
npm warn EBADENGINE   current: { node: 'v23.11.0', npm: '11.3.0' }
npm warn EBADENGINE }
```

### Recommendations:

1. Use Node.js v22.x.x or earlier for the most compatible experience
2. If you must use Node.js v23+, you can:
   - Add the `--force` flag to npm commands: `npm install --force`
   - Set the environment variable: `NODE_OPTIONS=--engine-strict=false`
   - Be aware that some packages may not work correctly

## Deprecated Packages

The following packages are deprecated but still used as dependencies or transitive dependencies:

1. **inflight@1.0.6**: Memory leak issues. Consider using lru-cache instead.
2. **stable@0.1.8**: No longer needed as modern JS guarantees Array#sort() stability.
3. **@babel/plugin-proposal-class-properties@7.18.6**: Use @babel/plugin-transform-class-properties instead.
4. **@humanwhocodes/config-array@0.5.0**: Use @eslint/config-array instead.
5. **abab@2.0.6**: Use your platform's native atob() and btoa() methods instead.
6. **rimraf@3.0.2**: Update to v4+ for better maintenance.
7. **consolidate@0.15.1**: Update to v1.0.0+ for bug fixes.
8. **glob@7.2.3**: Update to v9+ for better maintenance.
9. **domexception@2.0.1**: Use your platform's native DOMException instead.
10. **w3c-hr-time@1.0.2**: Use your platform's native performance.now() and performance.timeOrigin.
11. **@humanwhocodes/object-schema@1.2.1**: Use @eslint/object-schema instead.
12. **webpack-chain@6.5.1**: Package no longer supported.
13. **eslint@7.32.0**: Update to a newer version for better support.

Most of these deprecated packages are transitive dependencies of development tools and don't affect the production build. Updating them may require major version updates to the parent packages, which could introduce breaking changes.

The `npm run fix-vulnerabilities` script may help update some of these packages, but manual updates to parent packages may be required for others.

## Testing After Security Updates

After applying security updates or running the `fix-vulnerabilities` script, it's crucial to test your application thoroughly:

1. **Build the Library**
   ```bash
   npm run build:lib
   ```

2. **Run the Development Server**
   ```bash
   npm run serve
   ```

3. **Run Tests**
   ```bash
   npm run test
   ```

4. **Check for Regressions**
   - Test all form builder functionality
   - Verify that drag and drop still works
   - Ensure form validation works correctly
   - Test form submission
   - Check that the exported form code works as expected

If you encounter any issues after updating dependencies, you may need to:
1. Revert specific dependency updates
2. Apply patches to fix compatibility issues
3. Update your code to work with the new dependency versions
