import {
    slicedToArray as _slicedToArray,
    createClass as _createClass,
    classCallCheck as _classCallCheck
} from "../../_virtual/_rollupPluginBabelHelpers.js";
import { utilities } from "dcmjs";
import CORNERSTONE_3D_TAG from "./cornerstone3DTag.js";
import MeasurementReport from "./MeasurementReport.js";

var TID300Point = utilities.TID300.Point;
var PROBE = "Probe";
var trackingIdentifierTextValue = ""
    .concat(CORNERSTONE_3D_TAG, ":")
    .concat(PROBE);
var Probe = /*#__PURE__*/ (function () {
    function Probe() {
        _classCallCheck(this, Probe);
    }
    return _createClass(Probe, null, [
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
                            Probe.toolType
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
                        points: worldCoords,
                        activeHandleIndex: null,
                        textBox: {
                            hasMoved: false
                        }
                    },
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
                    metadata = tool.metadata;
                var finding = tool.finding,
                    findingSites = tool.findingSites;
                var referencedImageId = metadata.referencedImageId;
                if (!referencedImageId) {
                    throw new Error(
                        "Probe.getTID300RepresentationArguments: referencedImageId is not defined"
                    );
                }
                var points = data.handles.points;
                var pointsImage = points.map(function (point) {
                    var pointImage = worldToImageCoords(
                        referencedImageId,
                        point
                    );
                    return {
                        x: pointImage[0],
                        y: pointImage[1]
                    };
                });
                var TID300RepresentationArguments = {
                    points: pointsImage,
                    trackingIdentifierTextValue: trackingIdentifierTextValue,
                    findingSites: findingSites || [],
                    finding: finding
                };
                return TID300RepresentationArguments;
            }
        }
    ]);
})();
Probe.toolType = PROBE;
Probe.utilityToolType = PROBE;
Probe.TID300Representation = TID300Point;
Probe.isValidCornerstoneTrackingIdentifier = function (TrackingIdentifier) {
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
    return toolType === PROBE;
};
MeasurementReport.registerTool(Probe);

export { Probe as default };
