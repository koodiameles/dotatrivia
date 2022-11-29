module.exports = function(api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],

    // this enables safe use of environment variables
    // uses react-native-dotenv library
    plugins: [["module:react-native-dotenv", {"moduleName": "@env","path": ".env"}]] 
  };
};
