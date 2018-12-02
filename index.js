module.exports = bundler => {
    bundler.addAssetType('html', require.resolve('./html-asset'));
    bundler.addAssetType('htm', require.resolve('./html-asset'));
};
