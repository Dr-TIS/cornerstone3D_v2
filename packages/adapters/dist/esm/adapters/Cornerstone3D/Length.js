import {
    slicedToArray as _slicedToArray,
    createClass as _createClass,
    defineProperty as _defineProperty,
    classCallCheck as _classCallCheck
} from "../../_virtual/_rollupPluginBabelHelpers.js";
import { utilities } from "dcmjs";
import CORNERSTONE_3D_TAG from "./cornerstone3DTag.js";
import MeasurementReport from "./MeasurementReport.js";

var TID300Length = utilities.TID300.Length;
var LENGTH = "Length";
var trackingIdentifierTextValue = ""
    .concat(CORNERSTONE_3D_TAG, ":")
    .concat(LENGTH);
var Length = /*#__PURE__*/ (function () {
    function Length() {
        _classCallCheck(this, Length);
    }
    return _createClass(Length, null, [
        {
            key: "getMeasurementData",
            value:
                // TODO: this function is required for all Cornerstone Tool Adapters, since it is called by MeasurementReport.
                function getMeasurementData(
                    MeasurementGroup,
                    sopInstanceUIDToImageIdMap,
                    imageToWorldCoords,
                    metadata
                ) {
                    var _MeasurementReport$ge =
                            MeasurementReport.getSetupMeasurementData(
                                MeasurementGroup,
                                sopInstanceUIDToImageIdMap,
                                metadata,
                                Length.toolType
                            ),
                        defaultState = _MeasurementReport$ge.defaultState,
                        NUMGroup = _MeasurementReport$ge.NUMGroup,
                        SCOORDGroup = _MeasurementReport$ge.SCOORDGroup,
                        ReferencedFrameNumber =
                            _MeasurementReport$ge.ReferencedFrameNumber;
                    var referencedImageId =
                        defaultState.annotation.metadata.referencedImageId;
                    var GraphicData = SCOORDGroup.GraphicData;
                    var worldCoords = [];
                    for (var i = 0; i < GraphicData.length; i += 2) {
                        var point = imageToWorldCoords(referencedImageId, [
                            GraphicData[i],
                            GraphicData[i + 1]
                        ]);
                        worldCoords.push(point);
                    }
                    var state = defaultState;
                    state.annotation.data = {
                        handles: {
                            points: [worldCoords[0], worldCoords[1]],
                            activeHandleIndex: 0,
                            textBox: {
                                hasMoved: false
                            }
                        },
                        cachedStats: _defineProperty(
                            {},
                            "imageId:".concat(referencedImageId),
                            {
                                length: NUMGroup
                                    ? NUMGroup.MeasuredValueSequence
                                          .NumericValue
                                    : 0
                            }
                        ),
                        frameNumber: ReferencedFrameNumber
                    };
                    return state;
                }
        },
        {
            key: "getTID300RepresentationArguments",
            value: function getTID300RepresentationArguments(
                tool,
                worldToImageCoords
            ) {
                var data = tool.data,
                    finding = tool.finding,
                    findingSites = tool.findingSites,
                    metadata = tool.metadata;
                var _data$cachedStats = data.cachedStats,
                    cachedStats =
                        _data$cachedStats === void 0 ? {} : _data$cachedStats,
                    handles = data.handles;
                var referencedImageId = metadata.referencedImageId;
                if (!referencedImageId) {
                    throw new Error(
                        "Length.getTID300RepresentationArguments: referencedImageId is not defined"
                    );
                }
                var start = worldToImageCoords(
                    referencedImageId,
                    handles.points[0]
                );
                var end = worldToImageCoords(
                    referencedImageId,
                    handles.points[1]
                );
                var point1 = {
                    x: start[0],
                    y: start[1]
                };
                var point2 = {
                    x: end[0],
                    y: end[1]
                };
                var _ref =
                        cachedStats["imageId:".concat(referencedImageId)] || {},
                    distance = _ref.length;
                return {
                    point1: point1,
                    point2: point2,
                    distance: distance,
                    trackingIdentifierTextValue: trackingIdentifierTextValue,
                    finding: finding,
                    findingSites: findingSites || []
                };
            }
        }
    ]);
})();
Length.toolType = LENGTH;
Length.utilityToolType = LENGTH;
Length.TID300Representation = TID300Length;
Length.isValidCornerstoneTrackingIdentifier = function (TrackingIdentifier) {
    if (!TrackingIdentifier.includes(":")) {
        return false;
    }
    var _TrackingIdentifier$s = TrackingIdentifier.split(":"),
        _TrackingIdentifier$s2 = _slicedToArray(_TrackingIdentifier$s, 2),
        cornerstone3DTag = _TrackingIdentifier$s2[0],
        toolType = _TrackingIdentifier$s2[1];
    if (cornerstone3DTag !== CORNERSTONE_3D_TAG) {
        return false;
    }
    return toolType === LENGTH;
};
MeasurementReport.registerTool(Length);

export { Length as default };
