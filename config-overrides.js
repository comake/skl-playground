const webpack = require('webpack');
module.exports = function override(config) {
  config.target = "web";
	const fallback = config.resolve.fallback || {};
	Object.assign(fallback, {
    "stream": require.resolve("stream-browserify"),
    "path": require.resolve("path-browserify"),
    "util": require.resolve("util/"),
    "url": require.resolve("url/"),
    "http": require.resolve("stream-http"),
    "https": require.resolve("https-browserify"),
    "crypto": require.resolve("crypto-browserify"),
  })
  config.resolve.fallback = fallback;

  config.plugins = (config.plugins || []).concat([
    new webpack.ProvidePlugin({
      Buffer: ['buffer', 'Buffer'],
      process: 'process/browser',
    })
  ]);
  
  config.module.rules.push({
    test: /\.svg$/,
    use: [
      {
        loader: 'file-loader',
        options: {
          name: 'images/[hash]-[name].[ext]',
        },
      },
    ],
  });

  config.module.rules.push({
    test: /\.m?js/,
    resolve: {
      fullySpecified: false
    }
  });
  
  return config;
}
