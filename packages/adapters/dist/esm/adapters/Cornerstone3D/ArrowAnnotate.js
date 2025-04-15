import {
    slicedToArray as _slicedToArray,
    createClass as _createClass,
    classCallCheck as _classCallCheck
} from "../../_virtual/_rollupPluginBabelHelpers.js";
import MeasurementReport from "./MeasurementReport.js";
import { utilities } from "dcmjs";
import CORNERSTONE_3D_TAG from "./cornerstone3DTag.js";
import CodingScheme from "./CodingScheme.js";

var TID300Point = utilities.TID300.Point;
var ARROW_ANNOTATE = "ArrowAnnotate";
var trackingIdentifierTextValue = ""
    .concat(CORNERSTONE_3D_TAG, ":")
    .concat(ARROW_ANNOTATE);
var codeValues = CodingScheme.codeValues,
    CodingSchemeDesignator = CodingScheme.CodingSchemeDesignator;
var ArrowAnnotate = /*#__PURE__*/ (function () {
    function ArrowAnnotate() {
        _classCallCheck(this, ArrowAnnotate);
    }
    return _createClass(ArrowAnnotate, null, [
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
                            ArrowAnnotate.toolType
                        ),
                    defaultState = _MeasurementReport$ge.defaultState,
                    SCOORDGroup = _MeasurementReport$ge.SCOORDGroup,
                    ReferencedFrameNumber =
                        _MeasurementReport$ge.ReferencedFrameNumber;
                var referencedImageId =
                    defaultState.annotation.metadata.referencedImageId;
                var text = defaultState.annotation.metadata.label;
                var GraphicData = SCOORDGroup.GraphicData;
                var worldCoords = [];
                for (var i = 0; i < GraphicData.length; i += 2) {
                    var point = imageToWorldCoords(referencedImageId, [
                        GraphicData[i],
                        GraphicData[i + 1]
                    ]);
                    worldCoords.push(point);
                }

                // Since the arrowAnnotate measurement is just a point, to generate the tool state
                // we derive the second point based on the image size relative to the first point.
                if (worldCoords.length === 1) {
                    var imagePixelModule = metadata.get(
                        "imagePixelModule",
                        referencedImageId
                    );
                    var xOffset = 10;
                    var yOffset = 10;
                    if (imagePixelModule) {
                        var columns = imagePixelModule.columns,
                            rows = imagePixelModule.rows;
                        xOffset = columns / 10;
                        yOffset = rows / 10;
                    }
                    var secondPoint = imageToWorldCoords(referencedImageId, [
                        GraphicData[0] + xOffset,
                        GraphicData[1] + yOffset
                    ]);
                    worldCoords.push(secondPoint);
                }
                var state = defaultState;
                state.annotation.data = {
                    text: text,
                    handles: {
                        arrowFirst: true,
                        points: [worldCoords[0], worldCoords[1]],
                        activeHandleIndex: 0,
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
                        "ArrowAnnotate.getTID300RepresentationArguments: referencedImageId is not defined"
                    );
                }
                var _data$handles = data.handles,
                    points = _data$handles.points,
                    arrowFirst = _data$handles.arrowFirst;
                var point;
                var point2;
                if (arrowFirst) {
                    point = points[0];
                    point2 = points[1];
                } else {
                    point = points[1];
                    point2 = points[0];
                }
                var pointImage = worldToImageCoords(referencedImageId, point);
                var pointImage2 = worldToImageCoords(referencedImageId, point2);
                var TID300RepresentationArguments = {
                    points: [
                        {
                            x: pointImage[0],
                            y: pointImage[1]
                        },
                        {
                            x: pointImage2[0],
                            y: pointImage2[1]
                        }
                    ],
                    trackingIdentifierTextValue: trackingIdentifierTextValue,
                    findingSites: findingSites || []
                };

                // If freetext finding isn't present, add it from the tool text.
                if (
                    !finding ||
                    finding.CodeValue !== codeValues.CORNERSTONEFREETEXT
                ) {
                    finding = {
                        CodeValue: codeValues.CORNERSTONEFREETEXT,
                        CodingSchemeDesignator: CodingSchemeDesignator,
                        CodeMeaning: data.text
                    };
                }
                TID300RepresentationArguments.finding = finding;
                return TID300RepresentationArguments;
            }
        }
    ]);
})();
ArrowAnnotate.toolType = ARROW_ANNOTATE;
ArrowAnnotate.utilityToolType = ARROW_ANNOTATE;
ArrowAnnotate.TID300Representation = TID300Point;
ArrowAnnotate.isValidCornerstoneTrackingIdentifier = function (
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
    return toolType === ARROW_ANNOTATE;
};
MeasurementReport.registerTool(ArrowAnnotate);

export { ArrowAnnotate as default };
