# Lluvias

This project is an Angular application deployed in AWS S3 under domain [lluvias.jaimeelingeniero.es](https://lluvias.jaimeelingeniero.es)

[![Build And Deploy](https://github.com/jaimemartinmartin15/lluvias.jaimeelingeniero.es/actions/workflows/build-and-publish.yml/badge.svg)](https://github.com/jaimemartinmartin15/lluvias.jaimeelingeniero.es/actions/workflows/build-and-publish.yml) [![Automatic Update](https://github.com/jaimemartinmartin15/lluvias.jaimeelingeniero.es/actions/workflows/automatic-update.yml/badge.svg)](https://github.com/jaimemartinmartin15/lluvias.jaimeelingeniero.es/actions/workflows/automatic-update.yml) [![Manual Update](https://github.com/jaimemartinmartin15/lluvias.jaimeelingeniero.es/actions/workflows/manual-update.yml/badge.svg)](https://github.com/jaimemartinmartin15/lluvias.jaimeelingeniero.es/actions/workflows/manual-update.yml)

## Development

Clone the repository:

```text
git clone https://github.com/jaimemartinmartin15/lluvias.jaimeelingeniero.es.git
```

Install dependencies:

```text
npm i
```

**Note**: To download certain dependencies (scoped with _@jaimemartinmartin15_) from GPR (GitHub Package Registry), you  require a valid personal access token. If obtaining one is not possible, remove the dependency from the [package.json](./package.json). In this situation, work without creating icons and remove any component or module import that cannot be resolved.

Run the application in **localhost**:

```text
npm start
```

Run the application in **private IP address**:

```text
npm run start:public
```

## Testing e2e

To start the e2e tests run:

```text
npm run test:e2e
```

The tests have some `expect` but they also generate [screenshots](./e2e/screenshots/e2e-results) that are compared to [originals](./e2e/screenshots/originals).

If you make any changes that impact how the application looks, e2e tests might start failing. After reviewing and confirming that the new screenshots are correct, move them to originals folder and commit them.

## Deploy

After doing the changes in your branch, increase the [package.json](./package.json) version and then run `npm i` to update the package-lock.json

Update also [CHANGELOG.md](./CHANGELOG.md) file.

Then merge the changes in `main` branch and create a tag with the same version than in the package.json

When pushing the tag to the remote, it will trigger the workflow **build-and-publish.yml** automatically to deploy it.

## Workflows

### automatic-update.yml

Automatically adds in [data files](./src/data/) a new line with zero liters at the end of each day, and deploys only the data files to the server.

### manual-update.yml

After manually changing any [data file](./src/data/) and pushing it to the remote, deploys them to the server.

### build-and-publish.yml

Builds and deploys the application to the server.
