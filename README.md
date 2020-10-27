## Add libraries

```console
yarn add next react react-dom
yarn add tailwind -D
```

## Init Tailwind

```console
npx tailwind init
```

Ensure the file tailwind.config.js was created with the next content:

```js
module.exports = {
  purge: [],
  theme: {
    extend: {},
  },
  variants: {},
  plugins: [],
};
```

## Adding PostCSS

PostCSS is a tool for transforming CSS with Javascript.

```console
touch postcss.config.js
```

Add the following to thad file

```js
module.exports = {
  plugins: ['tailwindcss'],
};
```

Besides TailwindCSS, we should also add the PostCSS Preset Env module, which converts modern CSS into something most browsers understand:

```console
yarn add postcss-preset-env -D
```

Update postcss.config.js with this module

```js
module.exports = {
  plugins: ['tailwindcss', 'postcss-preset-env'],
};
```

Now let’s create a styles folder and import Tailwind CSS from a CSS file:

```console
mkdir css touch css/tailwind.css
```

Inside tailwind.css

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

To add global CSS to a Next.js app, we need to override the default App component. Next.js uses the App component to initialize pages, and if we need to control the page initialization, we need to create a file called pages/\_app.js:

```console
touch pages/_app.js
```

And import the stylesheed we created

```js
import '../styles/tailwind.css';
export default function MyApp({ Component, pageProps }) {
  return <Component {...pageProps} />;
}
```

Now we can create pages with the magic of Tailwind

```console
touch pages/index.js
```

```js
export default function Home() {
  return (
    <div className='md:flex bg-white rounded-lg p-24 justify-center'>
      <img
        className='h-16 w-16 md:h-24 md:w-24 rounded-full mx-auto md:mx-0 md:mr-6'
        src='https://pbs.twimg.com/profile_images/1102120097081184257/61tO47TQ_400x400.jpg'
      />
      <div className='text-center md:text-left'>
        <h2 className='text-lg'>Jake Prins</h2>
        <div className='text-purple-500'>JavaScript developer</div>
        <div className='text-gray-600'>Twitter: @jakeprins_nl</div>
        <div className='text-gray-600'>www.jakeprins.com</div>
      </div>
    </div>
  );
}
```

# PurgeCSS

One problem with Tailwind CSS is the large file size, but we can use PurgeCSS to fix this. PurgeCSS reduces the file size by scanning your HTML and removing any classes that aren’t used. We only want this in production because if we are developing, we want to be able to use any Tailwind CSS class without running the build process. To set this up, we start by installing the PurgeCSS module as a dev dependency in our project:

```console
yarn add @fullhuman/postcss-purgecss -D
```

Then update your postcss.config.js file with the following code:

```js
const purgecss = [
  '@fullhuman/postcss-purgecss',
  {
    // Specify the paths to all of the template files
    content: [
      './pages/**/*.{js,jsx,ts,tsx}',
      './components/**/*.{js,jsx,ts,tsx}',
    ],
    // This is the function used to extract class names from the templates
    defaultExtractor: (content) => {
      // Capture as liberally as possible, including things like `h-(screen-1.5)`
      const broadMatches = content.match(/[^<>"'`\\s]*[^<>"'`\\s:]/g) || [];
      // Capture classes within other delimiters like .block(class="w-1/2") in Pug
      const innerMatches =
        content.match(/[^<>"'`\\s.()]*[^<>"'`\\s.():]/g) || [];
      return broadMatches.concat(innerMatches);
    },
  },
];
module.exports = {
  plugins: [
    'tailwindcss',
    process.env.NODE_ENV === 'production' ? purgecss : undefined,
    'postcss-preset-env',
  ],
};
```

Finally, it’s recommended to only apply PurgeCSS to Tailwind CSS’s utility classes — not to base styles or component classes. This will ensure you don’t accidentally purge important base styles when working with Next.js The easiest way to do this is to use PurgeCSS’s whitelisting feature to disable PurgeCSS for non-utility classes. Add this to your tailwind.css file:

```css
/* purgecss start ignore */
@tailwind base;
@tailwind components;
/* purgecss end ignore */
@tailwind utilities;
```
