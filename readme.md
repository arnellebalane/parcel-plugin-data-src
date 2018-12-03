# parcel-plugin-data-src

ParcelJS plugin to bundle resources defined in `data-src` and `data-srcset`
attributes.

This is particularly useful when doing lazyloading of images, which doesn't
directly place the image path in the `src` attribute.


## Installation

```bash
$ npm install --save-dev parcel-plugin-data-src
```


## Example

```html
<picture>
  <source
    data-srcset="
      ./images/image-lg.webp 1000w,
      ./images/image-md.webp 500w,
      ./images/image-sm.webp 250w"
    sizes="100vw"
    type="image/webp"
  >
  <img
    data-srcset="
      ./images/image-lg.jpg 1000w,
      ./images/image-md.jpg 500w,
      ./images/image-sm.jpg 250w"
    sizes="100vw"
    data-src="./images/image-lg.jpg"
    src="./images/image-placeholder.jpg"
  >
</picture>
```

By default, Parcel will only bundle `./images/image-placeholder.jpg` since it's
defined in the `src` attribute.

Using this plugin, the following resosurces that are defined in `data-srcset`
and `data-src` will also be bundled.

- `./images/image-lg.webp`
- `./images/image-md.webp`
- `./images/image-sm.webp`
- `./images/image-lg.jpg`
- `./images/image-md.jpg`
- `./images/image-sm.jpg`

## License

MIT License
