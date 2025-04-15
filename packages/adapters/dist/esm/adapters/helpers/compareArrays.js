import { utilities } from "dcmjs";

var nearlyEqual = utilities.orientation.nearlyEqual;
function compareArrays(array1, array2, tolerance) {
    if (array1.length !== array2.length) {
        return false;
    }
    for (var i = 0; i < array1.length; ++i) {
        if (!nearlyEqual(array1[i], array2[i], tolerance)) {
            return false;
        }
    }
    return true;
}

export { compareArrays as default };
