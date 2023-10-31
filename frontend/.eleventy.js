module.exports = function (eleventyConfig) {
    eleventyConfig.addPassthroughCopy("./src/css/");
    eleventyConfig.addWatchTarget("./src/css/");
    eleventyConfig.addPassthroughCopy("./src/images/");
    eleventyConfig.addShortcode("year", () => `${new Date().getFullYear()}`);

    // To Support .yaml Extension in _data
    // You may remove this if you can use JSON
    eleventyConfig.addDataExtension("yaml", (contents) => yaml.load(contents));

    return {
      dir: {
        input: "src",
        output: "public"
      }
    };
};