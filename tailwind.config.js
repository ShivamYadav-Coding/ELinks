module.exports = {
  purge: [
    './src/assets/js/*.js',
    './src/views/*.ejs',
    './src/views/partials/*.ejs'
  ],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      fontFamily: {
        // font-family: 'Roboto', sans-serif;
        body: ['Roboto'],
        headings: ['"Crimson Text"']
      }
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
}
