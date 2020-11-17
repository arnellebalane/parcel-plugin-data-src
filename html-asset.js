const HTMLAsset = require('parcel-bundler/src/assets/HTMLAsset');

// Additional attributes that my produce a dependency
const ATTRS = [
    'data-srcset',
    'data-src'
];

class ExtendedHTMLAsset extends HTMLAsset {
    collectDependencies() {
        super.collectDependencies();

        const {ast} = this;

        ast.walk(node => {
            if (node.attrs) {
                ATTRS.forEach(attr => {
                    if (node.attrs.hasOwnProperty(attr)) {
                        const depHandler = this.getAttrDepHandler(attr);
                        node.attrs[attr] = depHandler.call(this, node.attrs[attr]);
                        this.isAstDirty = true;
                    }
                });
            }

            return node;
        });
    }

    getAttrDepHandler(attr) {
        if (attr === 'srcset' || attr === 'data-srcset') {
            return this.collectSrcSetDependencies;
        }
        return this.processSingleDependency;
    }
}

module.exports = ExtendedHTMLAsset;
