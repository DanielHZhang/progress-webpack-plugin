# Progress Webpack Plugin

A plugin for [Webpack 4](https://webpack.js.org/) that adds a minimal build progress in the command line during builds.

## Installation

Add as a dev-dependency to your `package.json` via npm or yarn

```bash
npm i @supersede/progress-webpack-plugin --save-dev
```

```bash
yarn add @supersede/progress-webpack-plugin -D
```

## Usage

Import the plugin into your Webpack configuration file:

```javascript
const ProgressWebpackPlugin = require('@supersede/progress-webpack-plugin');
```

```javascript
import ProgressWebpackPlugin from '@supersede/progress-webpack-plugin';
```

Add it to the list of plugins:

```javascript
plugins: [new SimpleProgressWebpackPlugin()];
```
