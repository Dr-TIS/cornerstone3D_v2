import checkIfPerpendicular from "./checkIfPerpendicular.js";
import compareArrays from "./compareArrays.js";

function checkOrientation(
    multiframe,
    validOrientations,
    sourceDataDimensions,
    tolerance
) {
    var SharedFunctionalGroupsSequence =
            multiframe.SharedFunctionalGroupsSequence,
        PerFrameFunctionalGroupsSequence =
            multiframe.PerFrameFunctionalGroupsSequence;
    var sharedImageOrientationPatient =
        SharedFunctionalGroupsSequence.PlaneOrientationSequence
            ? SharedFunctionalGroupsSequence.PlaneOrientationSequence
                  .ImageOrientationPatient
            : undefined;
    var PerFrameFunctionalGroups = PerFrameFunctionalGroupsSequence[0];
    var iop =
        sharedImageOrientationPatient ||
        PerFrameFunctionalGroups.PlaneOrientationSequence
            .ImageOrientationPatient;
    var inPlane = validOrientations.some(function (operation) {
        return compareArrays(iop, operation, tolerance);
    });
    if (inPlane) {
        return "Planar";
    }
    if (
        checkIfPerpendicular(iop, validOrientations[0], tolerance) &&
        sourceDataDimensions.includes(multiframe.Rows) &&
        sourceDataDimensions.includes(multiframe.Columns)
    ) {
        return "Perpendicular";
    }
    return "Oblique";
}

export { checkOrientation as default };
