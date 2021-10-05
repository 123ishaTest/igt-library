# igt-library
> A collection of useful scripts to help you develop Incremental Games.

[Please visit the actual Docs here](https://123ishatest.github.io/igt-docs)

## Requirements
- [Nodejs](https://nodejs.org/en/) >= v12.13.0.

## Project setup
```
npm install
```

### Run all tests
```
npm run test
```

### Compiles and minifies for production
```
npm run build
```

### Lints and fixes files
```
npm run lint
```

### Deploy to npm
```
npm run semantic-release
```

### Troubleshooting

#### .flat is not a function
If you get the following error
```
Syntax Error: TypeError: [(...variantsValue),(...extensions)].flat is not a function
```
This is caused by not having Nodejs >= v12.13.0. Please update your node version.
