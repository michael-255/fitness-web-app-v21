# Fitness Tracker

Fitness Tracker is a comprehensive and user-friendly app designed to help you achieve your fitness
goals. With a clean and intuitive interface, it offers a variety of features to track and enhance
your workouts, exercises, and overall fitness journey.

## TODO

-   Workouts Dashboard
    -   Work on CRUD dialogs?
        -   `Inspect` first
-   Exercises Dashboard
-   See how to get `newlines` to work in notes and descriptions

## Post Cloning Steps

-   [ ] Update `README.md`

    -   [ ] Change README main heading to your project name
    -   [ ] Add detailed project description
    -   [ ] Update the `Credits` section as needed
    -   [ ] Remove unneeded `Post Cloning Steps` section
    -   [ ] Remove unneeded `Project Creation Steps` section and ToC links

## Table of Contents

-   [Recommended IDE Setup](#recommended-ide-setup)
-   [Type Support for `.vue` Imports in TS](#type-support-for-vue-imports-in-ts)
-   [Customize configuration](#customize-configuration)
-   [Project Usage](#project-usage)
-   [Project Creation Steps](#project-creation-steps)
    1. [Setup Vue](#1-setup-vue)
    2. [Setup GitHub Pages](#2-setup-github-pages)
    3. [Configure Prettier](#3-configure-prettier)
    4. [Setup Quasar](#4-setup-quasar)
    5. [Install Dexie](#5-install-dexie)
    6. [Install Zod](#6-install-zod)

## Recommended IDE Setup

[VSCode](https://code.visualstudio.com/) +
[Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur) +
[TypeScript Vue Plugin (Volar)](https://marketplace.visualstudio.com/items?itemName=Vue.vscode-typescript-vue-plugin).

## Type Support for `.vue` Imports in TS

TypeScript cannot handle type information for `.vue` imports by default, so we replace the `tsc` CLI
with `vue-tsc` for type checking. In editors, we need
[TypeScript Vue Plugin (Volar)](https://marketplace.visualstudio.com/items?itemName=Vue.vscode-typescript-vue-plugin)
to make the TypeScript language service aware of `.vue` types.

If the standalone TypeScript plugin doesn't feel fast enough to you, Volar has also implemented a
[Take Over Mode](https://github.com/johnsoncodehk/volar/discussions/471#discussioncomment-1361669)
that is more performant. You can enable it by the following steps:

1. Disable the built-in TypeScript Extension
    1. Run `Extensions: Show Built-in Extensions` from VSCode's command palette
    2. Find `TypeScript and JavaScript Language Features`, right click and select
       `Disable (Workspace)`
2. Reload the VSCode window by running `Developer: Reload Window` from the command palette.

## Customize configuration

See [Vite Configuration Reference](https://vitejs.dev/config/).

## Project Usage

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Type-Check, Compile and Minify for Production

```sh
npm run build
```

### Run Unit Tests with [Vitest](https://vitest.dev/)

```sh
npm run test:unit
```

### Run End-to-End Tests with [Cypress](https://www.cypress.io/)

```sh
npm run test:e2e:dev
```

This runs the end-to-end tests against the Vite development server. It is much faster than the
production build.

But it's still recommended to test the production build with `test:e2e` before deploying (e.g. in CI
environments):

```sh
npm run build
npm run test:e2e
```

### Lint with [ESLint](https://eslint.org/)

```sh
npm run lint
```

## Project Creation Steps

I've listed links to documentation along with steps I took to create this project below.

-   [animate.css](https://animate.style/)
-   [Cypress](https://docs.cypress.io/guides/overview/why-cypress)
-   [Dexie](https://dexie.org/docs/API-Reference)
-   [ESLint](https://eslint.org/docs/latest/use/getting-started)
-   [Pinia](https://pinia.vuejs.org/introduction.html)
-   [Prettier](https://prettier.io/docs/en/)
-   [PWA](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps)
-   [Quasar](https://quasar.dev/start/vite-plugin)
-   [Vite](https://vitejs.dev/guide/static-deploy.html#github-pages)
-   [Vitest](https://vitest.dev/guide/)
-   [Vue 3](https://vuejs.org/guide/quick-start.html#creating-a-vue-application)
-   [Vue Router](https://router.vuejs.org/guide/)
-   [Zod](https://zod.dev/)

---

1. Setup Vue

    Create the Vue project directory and initial files.

    - Navigate to the directory you would like to create the project in
    - Run the create Vue command
    - Use the selections you would like for your project
    - Navigate into your project directory and install the dependencies

    ```sh
    npm create vue@latest

    ✔ Project name: PROJECT_NAME
    ✔ Add TypeScript? Yes
    ✔ Add JSX Support? No
    ✔ Add Vue Router for Single Page Application development? Yes
    ✔ Add Pinia for state management? Yes
    ✔ Add Vitest for Unit testing? Yes
    ✔ Add an End-to-End Testing Solution? Cypress
    ✔ Add ESLint for code quality? Yes
    ✔ Add Prettier for code formatting? Yes

    cd PROJECT_NAME
    npm install
    ```

2. Setup GitHub Pages

    Configure GitHub Pages to deploy using GitHub Actions.

    - Add `base: '/REPO_NAME/'` to `vite.config.ts`
    - In GitHub for this repository, go to `Settings` > `Pages`
    - Under `Build and Deployment` > `Source`, select `GitHub Actions`
    - Create this workflow file in `~/.github/workflows/deploy-github-pages.yml`

    ```yml
    name: Deploy static content to GitHub Pages
    run-name: Deploying "${{ github.repository }}" to GitHub Pages
    on:
        push:
            branches: ['main']

        # Allows you to run this workflow manually from the Actions tab
        workflow_dispatch:
    # Sets the GITHUB_TOKEN permissions to allow deployment to GitHub Pages
    permissions:
        contents: read
        pages: write
        id-token: write
    # Allow one concurrent deployment
    concurrency:
        group: 'pages'
        cancel-in-progress: true

    jobs:
        deploy_github_pages:
            runs-on: ubuntu-latest
            environment:
                name: github-pages
                url: ${{ steps.deployment.outputs.page_url }}
            steps:
                # Information
                - name: Workflow Information
                run: |
                    echo "Repository: ${{ github.repository }}"
                    echo "Ref: ${{ github.ref }}"
                    echo "Commit SHA: ${{ github.sha }}"
                    echo "Run ID: ${{ github.run_id }}"
                    echo "Actor: ${{ github.actor }}"
                    echo "Event Name: ${{ github.event_name }}"
                # Build
                - name: Checkout
                uses: actions/checkout@v4
                - name: Set up Node
                uses: actions/setup-node@v3
                with:
                    node-version: 18
                    cache: 'npm'
                - name: Install dependencies
                run: npm ci
                - name: Build
                run: npm run build
                # Test
                - name: Unit Test + Coverage
                run: npm test
                # Deploy
                - name: Setup Pages
                uses: actions/configure-pages@v3
                - name: Upload artifact
                uses: actions/upload-pages-artifact@v2
                with:
                    path: './dist'
                - name: Deploy to GitHub Pages
                id: deployment
                uses: actions/deploy-pages@v2
    ```

3. Configure Prettier

    Replace the `.prettierrc.json` file contents with these settings (optional).

    ```json
    {
        "$schema": "https://json.schemastore.org/prettierrc",
        "printWidth": 120,
        "tabWidth": 4,
        "useTabs": false,
        "semi": false,
        "singleQuote": true,
        "quoteProps": "as-needed",
        "trailingComma": "all",
        "bracketSpacing": true,
        "bracketSameLine": false,
        "arrowParens": "always",
        "proseWrap": "always",
        "htmlWhitespaceSensitivity": "css",
        "vueIndentScriptAndStyle": false,
        "endOfLine": "lf"
    }
    ```

4. Setup Quasar

    Install Quasar and the Vite plugin.

    ```sh
    npm install --save quasar @quasar/extras
    npm install --save-dev @quasar/vite-plugin sass@1.32.12
    ```

    Merge these changes into the `vite.config.ts` file.

    ```typescript
    // FILE: vite.config.ts
    import { quasar, transformAssetUrls } from '@quasar/vite-plugin'
    import vue from '@vitejs/plugin-vue'
    import { URL, fileURLToPath } from 'node:url'
    import { defineConfig } from 'vite'
    // https://vitejs.dev/config/
    export default defineConfig({
        plugins: [
            vue({
                template: { transformAssetUrls },
            }),
            quasar({
                autoImportComponentCase: 'kebab',
            }),
        ],
        resolve: {
            alias: {
                '@': fileURLToPath(new URL('./src', import.meta.url)),
            },
        },
        base: '/web-app-template-v5/',
    })
    ```

    ```typescript
    // FILE: main.ts
    import './assets/main.css'
    import { createApp } from 'vue'
    import { createPinia } from 'pinia'
    import { Meta, Dialog, Notify, Quasar } from 'quasar'
    import router from './router'
    import App from './App.vue'
    import quasarIconSet from 'quasar/icon-set/material-symbols-rounded'
    import '@quasar/extras/roboto-font/roboto-font.css'
    import '@quasar/extras/material-symbols-rounded/material-symbols-rounded.css'
    // A few examples for animations from Animate.css:
    // import @quasar/extras/animate/fadeIn.css
    // import @quasar/extras/animate/fadeOut.css
    import 'quasar/dist/quasar.css'

    const app = createApp(App)

    app.use(createPinia())
    app.use(router)
    app.use(Quasar, {
        iconSet: quasarIconSet,
        plugins: {
            Meta,
            Dialog,
            Notify,
        },
        config: {
            dark: true,
            /*
            brand: {
                primary: '#1976d2', // indigo (Primary Brand Color)
                secondary: '#607d8b', // blue-grey (LOG)
                accent: '#673ab7', // deep-purple-6 (DEBUG)
                info: '#0d47a1', // blue-10 (INFO)
                warning: '#ff6f00', // amber-10 (WARN)
                negative: '#C10015', // negative (ERROR)
                positive: '#4caf50', // green
                dark: '#1d1d1d',
                'dark-page': '#121212',
            },
            */
            notify: {
                textColor: 'white',
                position: 'top',
                multiLine: false,
                timeout: 4000,
                actions: [
                    {
                        label: 'Dismiss',
                        color: 'white',
                    },
                ],
            },
            // loading: {...}, // default set of options for Loading Quasar plugin
            // loadingBar: { ... }, // settings for LoadingBar Quasar plugin
            // ..and many more (check Installation card on each Quasar component/directive/plugin)
        },
    })
    app.mount('#app')
    ```

5. Install Dexie for local database storage using IndexedDB

    ```sh
    npm install --save dexie
    ```

6. Install Zod for data validation

    ```sh
    npm install --save zod
    ```

## Icons

Use the following site to help with application icons: <https://realfavicongenerator.net/>

## Credits

Base `Web App Template` created by Michael Joy (michael-255 on GitHub)
