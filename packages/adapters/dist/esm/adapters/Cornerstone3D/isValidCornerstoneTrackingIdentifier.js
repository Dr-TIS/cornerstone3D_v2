import { slicedToArray as _slicedToArray } from "../../_virtual/_rollupPluginBabelHelpers.js";
import CORNERSTONE_3D_TAG from "./cornerstone3DTag.js";

function isValidCornerstoneTrackingIdentifier(trackingIdentifier) {
    if (!trackingIdentifier.includes(":")) {
        return false;
    }
    var _trackingIdentifier$s = trackingIdentifier.split(":"),
        _trackingIdentifier$s2 = _slicedToArray(_trackingIdentifier$s, 2),
        cornerstone3DTag = _trackingIdentifier$s2[0],
        toolType = _trackingIdentifier$s2[1];
    if (cornerstone3DTag !== CORNERSTONE_3D_TAG) {
        return false;
    }
    return toolType.toLowerCase() === this.toolType.toLowerCase();
}

export { isValidCornerstoneTrackingIdentifier as default };
