/**
 * 图片覆盖物公共参数
 * @module $ui/map/mixins/image
 */
export default {
  props: {
    // Anchor. Default value is the icon center.
    anchor: Array,
    // Origin of the anchor: bottom-left, bottom-right, top-left or top-right.
    anchorOrigin: String,
    // Units in which the anchor x value is specified. A value of 'fraction' indicates the x value is a fraction of the icon. A value of 'pixels' indicates the x value in pixels.
    anchorXUnits: String,
    // Units in which the anchor y value is specified. A value of 'fraction' indicates the y value is a fraction of the icon. A value of 'pixels' indicates the y value in pixels.
    anchorYUnits: String,
    // Color to tint the icon. If not specified, the icon will be left as is.
    color: String,
    // The crossOrigin attribute for loaded images. Note that you must provide a crossOrigin value if you want to access pixel data with the Canvas renderer
    crossOrigin: String,
    // Offset, which, together with the size and the offset origin, define the sub-rectangle to use from the original icon image.
    offset: Array,
    // Displacement the icon
    displacement: Array,
    // Origin of the offset: bottom-left, bottom-right, top-left or top-right.
    offsetOrigin: String,
    // Opacity of the icon.
    opacity: Number,
    // Scale.
    scale: Number,
    // Whether to rotate the icon with the view.
    rotateWithView: Boolean,
    // Rotation in radians (positive rotation clockwise).
    rotation: Number,
    // Icon size in pixel. Can be used together with offset to define the sub-rectangle to use from the origin (sprite) icon image.
    size: Array
  }
}
