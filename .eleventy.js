const yaml = require("js-yaml");
const eleventyWebcPlugin = require("@11ty/eleventy-plugin-webc");
const { eleventyImagePlugin } = require("@11ty/eleventy-img");

module.exports = function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy("src/assets/styles/");
  eleventyConfig.addWatchTarget("src/assets/styles/");
  eleventyConfig.addPassthroughCopy("src/assets/images/");
  eleventyConfig.addPassthroughCopy("src/model/");
  eleventyConfig.addPassthroughCopy("src/js/");
  eleventyConfig.addShortcode("year", () => `${new Date().getFullYear()}`);

  // Put robots.txt in root
  eleventyConfig.addPassthroughCopy({ 'src/robots.txt': '/robots.txt' });

  // To Support .yaml Extension in _data
  eleventyConfig.addDataExtension("yaml", (contents) => yaml.load(contents));

  // WebC
  eleventyConfig.addPlugin(eleventyWebcPlugin, {
    components: [
      // …
      // Add as a global WebC component
      "npm:@11ty/eleventy-img/*.webc",
    ]
  });

  // Image plugin
  eleventyConfig.addPlugin(eleventyImagePlugin, {
    // Set global default options
    formats: ["webp", "jpeg"],
    urlPath: "/img/",

    // Notably `outputDir` is resolved automatically
    // to the project output directory

    defaultAttributes: {
      loading: "lazy",
      decoding: "async"
    }
  });

  return {
    dir: {
      input: "src",
      output: "public"
    }
  };
};

