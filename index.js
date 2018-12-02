const HTMLAsset = require('./html-asset');

module.exports = bundler => {
    bundler.addAssetType('html', HTMLAsset);
    bundler.addAssetType('htm', HTMLAsset);
};
