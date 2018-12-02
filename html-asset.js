const HTMLAsset = require('parcel-bundler/src/assets/HTMLAsset');

/*
 * A list of all attributes that may produce a dependency
 * Based on https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes
 */
const ATTRS = {
    'src': [
        'script',
        'img',
        'audio',
        'video',
        'source',
        'track',
        'iframe',
        'embed'
    ],
    'href': ['link', 'a', 'use'],
    'srcset': ['img', 'source'],
    'data-srcset': ['img', 'source'],
    'data-src': ['img'],
    'poster': ['video'],
    'xlink:href': ['use', 'image'],
    'content': ['meta'],
    'data': ['object']
};

const META = {
    property: [
        'og:image',
        'og:image:url',
        'og:image:secure_url',
        'og:audio',
        'og:audio:secure_url',
        'og:video',
        'og:video:secure_url'
    ],
    name: [
        'twitter:image',
        'msapplication-square150x150logo',
        'msapplication-square310x310logo',
        'msapplication-square70x70logo',
        'msapplication-wide310x150logo',
        'msapplication-TileImage',
        'msapplication-config'
    ],
    itemprop: [
        'image',
        'logo',
        'screenshot',
        'thumbnailUrl',
        'contentUrl',
        'downloadUrl'
    ]
};

const OPTIONS = {
    a: {
        href: {entry: true}
    },
    iframe: {
        src: {entry: true}
    }
};

class ExtendedHTMLAsset extends HTMLAsset {
    collectDependencies() {
        const {ast} = this;

        // Add bundled dependencies from plugins like posthtml-extend or posthtml-include, if any
        if (ast.messages) {
            ast.messages.forEach(message => {
                if (message.type === 'dependency') {
                    this.addDependency(message.file, {
                        includedInParent: true
                    });
                }
            });
        }

        ast.walk(node => {
            if (node.attrs) {
                if (node.tag === 'meta') {
                    if (
                        !Object.keys(node.attrs).some(attr => {
                            const values = META[attr];
                            return (values && values.includes(node.attrs[attr]) && node.attrs.content !== '');
                        })
                    ) {
                        return node;
                    }
                }

                if (node.tag === 'link' && node.attrs.rel === 'manifest' && node.attrs.href) {
                    node.attrs.href = this.getAttrDepHandler('href').call(
                        this,
                        node.attrs.href,
                        {entry: true}
                    );
                    this.isAstDirty = true;
                    return node;
                }

                for (const attr in node.attrs) {
                    if (node.attrs.hasOwnProperty(attr)) {
                        const elements = ATTRS[attr];
                        // Check for virtual paths
                        if (node.tag === 'a' && node.attrs[attr].lastIndexOf('.') < 1) {
                            continue;
                        }

                        if (elements && elements.includes(node.tag)) {
                            const depHandler = this.getAttrDepHandler(attr);
                            const options = OPTIONS[node.tag];
                            node.attrs[attr] = depHandler.call(
                                this,
                                node.attrs[attr],
                                options && options[attr]
                            );
                            this.isAstDirty = true;
                        }
                    }
                }
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
