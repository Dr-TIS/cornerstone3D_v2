import {
    slicedToArray as _slicedToArray,
    createClass as _createClass,
    classCallCheck as _classCallCheck
} from "../../_virtual/_rollupPluginBabelHelpers.js";
import { utilities } from "dcmjs";
import CORNERSTONE_3D_TAG from "./cornerstone3DTag.js";
import MeasurementReport from "./MeasurementReport.js";

var _UltrasoundDirectional;
var TID300Length = utilities.TID300.Length;
var ULTRASOUND_DIRECTIONAL = "UltrasoundDirectionalTool";
var trackingIdentifierTextValue = ""
    .concat(CORNERSTONE_3D_TAG, ":")
    .concat(ULTRASOUND_DIRECTIONAL);
var UltrasoundDirectional = /*#__PURE__*/ (function () {
    function UltrasoundDirectional() {
        _classCallCheck(this, UltrasoundDirectional);
    }
    return _createClass(UltrasoundDirectional, null, [
        {
            key: "getMeasurementData",
            value: function getMeasurementData(
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
                            UltrasoundDirectional.toolType
                        ),
                    defaultState = _MeasurementReport$ge.defaultState,
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
                    cachedStats: {},
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
                var handles = data.handles;
                var referencedImageId = metadata.referencedImageId;
                if (!referencedImageId) {
                    throw new Error(
                        "UltrasoundDirectionalTool.getTID300RepresentationArguments: referencedImageId is not defined"
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
                return {
                    point1: point1,
                    point2: point2,
                    trackingIdentifierTextValue: trackingIdentifierTextValue,
                    finding: finding,
                    findingSites: findingSites || []
                };
            }
        }
    ]);
})();
_UltrasoundDirectional = UltrasoundDirectional;
_UltrasoundDirectional.toolType = ULTRASOUND_DIRECTIONAL;
_UltrasoundDirectional.utilityToolType = ULTRASOUND_DIRECTIONAL;
_UltrasoundDirectional.TID300Representation = TID300Length;
_UltrasoundDirectional.isValidCornerstoneTrackingIdentifier = function (
    TrackingIdentifier
) {
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
    return toolType === ULTRASOUND_DIRECTIONAL;
};
MeasurementReport.registerTool(UltrasoundDirectional);

export { UltrasoundDirectional as default };
