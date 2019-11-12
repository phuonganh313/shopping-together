var webpack = require("webpack");
var path = require("path");
var minimize = false; // change to true if want to minimize the bulde file size
var plugins = [];
if (minimize) {
    plugins.push(
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false // set to true if you want to show all the warining when bundling file
            }
        })
    );
}

plugins.push(new webpack.optimize.DedupePlugin());
plugins.push(new webpack.optimize.AggressiveMergingPlugin())//Merge chunks
plugins.push(new webpack.optimize.OccurrenceOrderPlugin());

plugins.push(
    new webpack.DefinePlugin({
        "process.env": {
            NODE_ENV: JSON.stringify("production") //change to production when release module
        }
    })
);


var config = {
    mode: 'production',
    entry: {
        app: "./index.js"
    },
    output: {
        path: path.join(__dirname, "../build"),
        filename: "[name].js"
    },
    plugins: plugins,
    module: {
        loaders: [
            {
                test: /.jsx?$/,
                loader: "babel-loader",
                exclude: /node_modules/,
                query: { presets: ["es2015", "react"] }
            }
        ]
    }
};

module.exports = config;
