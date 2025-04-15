import {
    objectSpread2 as _objectSpread2,
    createClass as _createClass,
    classCallCheck as _classCallCheck
} from "../../_virtual/_rollupPluginBabelHelpers.js";
import { utilities, derivations, normalizers, data } from "dcmjs";
import CORNERSTONE_3D_TAG from "./cornerstone3DTag.js";
import { toArray } from "../helpers/toArray.js";
import { codeMeaningEquals } from "../helpers/codeMeaningEquals.js";
import "../helpers/downloadDICOMData.js";
import CodingScheme from "./CodingScheme.js";

var _MeasurementReport;
var TID1500 = utilities.TID1500,
    addAccessors = utilities.addAccessors;
var StructuredReport = derivations.StructuredReport;
var Normalizer = normalizers.Normalizer;
var TID1500MeasurementReport = TID1500.TID1500MeasurementReport,
    TID1501MeasurementGroup = TID1500.TID1501MeasurementGroup;
var DicomMetaDictionary = data.DicomMetaDictionary;
var FINDING = {
    CodingSchemeDesignator: "DCM",
    CodeValue: "121071"
};
var FINDING_SITE = {
    CodingSchemeDesignator: "SCT",
    CodeValue: "363698007"
};
var FINDING_SITE_OLD = {
    CodingSchemeDesignator: "SRT",
    CodeValue: "G-C0E3"
};
var codeValueMatch = function codeValueMatch(group, code, oldCode) {
    var ConceptNameCodeSequence = group.ConceptNameCodeSequence;
    if (!ConceptNameCodeSequence) {
        return;
    }
    var CodingSchemeDesignator = ConceptNameCodeSequence.CodingSchemeDesignator,
        CodeValue = ConceptNameCodeSequence.CodeValue;
    return (
        (CodingSchemeDesignator == code.CodingSchemeDesignator &&
            CodeValue == code.CodeValue) ||
        (oldCode &&
            CodingSchemeDesignator == oldCode.CodingSchemeDesignator &&
            CodeValue == oldCode.CodeValue)
    );
};
function getTID300ContentItem(
    tool,
    toolType,
    ReferencedSOPSequence,
    toolClass,
    worldToImageCoords
) {
    var args = toolClass.getTID300RepresentationArguments(
        tool,
        worldToImageCoords
    );
    args.ReferencedSOPSequence = ReferencedSOPSequence;
    var TID300Measurement = new toolClass.TID300Representation(args);
    return TID300Measurement;
}
function getMeasurementGroup(
    toolType,
    toolData,
    ReferencedSOPSequence,
    worldToImageCoords
) {
    var toolTypeData = toolData[toolType];
    var toolClass =
        MeasurementReport.CORNERSTONE_TOOL_CLASSES_BY_TOOL_TYPE[toolType];
    if (
        !toolTypeData ||
        !toolTypeData.data ||
        !toolTypeData.data.length ||
        !toolClass
    ) {
        return;
    }
    var Measurements = toolTypeData.data.map(function (tool) {
        return getTID300ContentItem(
            tool,
            toolType,
            ReferencedSOPSequence,
            toolClass,
            worldToImageCoords
        );
    });
    return new TID1501MeasurementGroup(Measurements);
}
var MeasurementReport = /*#__PURE__*/ (function () {
    function MeasurementReport() {
        _classCallCheck(this, MeasurementReport);
    }
    return _createClass(MeasurementReport, null, [
        {
            key: "getCornerstoneLabelFromDefaultState",
            value: function getCornerstoneLabelFromDefaultState(defaultState) {
                var _defaultState$finding = defaultState.findingSites,
                    findingSites =
                        _defaultState$finding === void 0
                            ? []
                            : _defaultState$finding,
                    finding = defaultState.finding;
                var cornersoneFreeTextCodingValue =
                    CodingScheme.codeValues.CORNERSTONEFREETEXT;
                var freeTextLabel = findingSites.find(function (fs) {
                    return fs.CodeValue === cornersoneFreeTextCodingValue;
                });
                if (freeTextLabel) {
                    return freeTextLabel.CodeMeaning;
                }
                if (
                    finding &&
                    finding.CodeValue === cornersoneFreeTextCodingValue
                ) {
                    return finding.CodeMeaning;
                }
            }
        },
        {
            key: "generateDatasetMeta",
            value: function generateDatasetMeta() {
                var fileMetaInformationVersionArray = new Uint8Array(2);
                fileMetaInformationVersionArray[1] = 1;
                var _meta = {
                    FileMetaInformationVersion: {
                        Value: [fileMetaInformationVersionArray.buffer],
                        vr: "OB"
                    },
                    TransferSyntaxUID: {
                        Value: ["1.2.840.10008.1.2.1"],
                        vr: "UI"
                    },
                    ImplementationClassUID: {
                        Value: [DicomMetaDictionary.uid()],
                        vr: "UI"
                    },
                    ImplementationVersionName: {
                        Value: ["dcmjs"],
                        vr: "SH"
                    }
                };
                return _meta;
            }
        },
        {
            key: "getSetupMeasurementData",
            value: function getSetupMeasurementData(
                MeasurementGroup,
                sopInstanceUIDToImageIdMap,
                metadata,
                toolType
            ) {
                var ContentSequence = MeasurementGroup.ContentSequence;
                var contentSequenceArr = toArray(ContentSequence);
                var findingGroup = contentSequenceArr.find(function (group) {
                    return codeValueMatch(group, FINDING);
                });
                var findingSiteGroups =
                    contentSequenceArr.filter(function (group) {
                        return codeValueMatch(
                            group,
                            FINDING_SITE,
                            FINDING_SITE_OLD
                        );
                    }) || [];
                var NUMGroup = contentSequenceArr.find(function (group) {
                    return group.ValueType === "NUM";
                });
                var SCOORDGroup = toArray(NUMGroup.ContentSequence).find(
                    function (group) {
                        return group.ValueType === "SCOORD";
                    }
                );
                var ReferencedSOPSequence =
                    SCOORDGroup.ContentSequence.ReferencedSOPSequence;
                var ReferencedSOPInstanceUID =
                        ReferencedSOPSequence.ReferencedSOPInstanceUID,
                    ReferencedFrameNumber =
                        ReferencedSOPSequence.ReferencedFrameNumber;
                var referencedImageId =
                    sopInstanceUIDToImageIdMap[ReferencedSOPInstanceUID];
                var imagePlaneModule = metadata.get(
                    "imagePlaneModule",
                    referencedImageId
                );
                var finding = findingGroup
                    ? addAccessors(findingGroup.ConceptCodeSequence)
                    : undefined;
                var findingSites = findingSiteGroups.map(function (fsg) {
                    return addAccessors(fsg.ConceptCodeSequence);
                });
                var defaultState = {
                    description: undefined,
                    sopInstanceUid: ReferencedSOPInstanceUID,
                    annotation: {
                        annotationUID: DicomMetaDictionary.uid(),
                        metadata: {
                            toolName: toolType,
                            referencedImageId: referencedImageId,
                            FrameOfReferenceUID:
                                imagePlaneModule.frameOfReferenceUID,
                            label: ""
                        },
                        data: undefined
                    },
                    finding: finding,
                    findingSites: findingSites
                };
                if (defaultState.finding) {
                    defaultState.description = defaultState.finding.CodeMeaning;
                }
                defaultState.annotation.metadata.label =
                    MeasurementReport.getCornerstoneLabelFromDefaultState(
                        defaultState
                    );
                return {
                    defaultState: defaultState,
                    NUMGroup: NUMGroup,
                    SCOORDGroup: SCOORDGroup,
                    ReferencedSOPSequence: ReferencedSOPSequence,
                    ReferencedSOPInstanceUID: ReferencedSOPInstanceUID,
                    ReferencedFrameNumber: ReferencedFrameNumber
                };
            }
        },
        {
            key: "generateReport",
            value: function generateReport(
                toolState,
                metadataProvider,
                worldToImageCoords,
                options
            ) {
                var allMeasurementGroups = [];
                var sopInstanceUIDsToSeriesInstanceUIDMap = {};
                var derivationSourceDatasets = [];
                var _meta = MeasurementReport.generateDatasetMeta();
                Object.keys(toolState).forEach(function (imageId) {
                    var sopCommonModule = metadataProvider.get(
                        "sopCommonModule",
                        imageId
                    );
                    var instance = metadataProvider.get("instance", imageId);
                    var sopInstanceUID = sopCommonModule.sopInstanceUID,
                        sopClassUID = sopCommonModule.sopClassUID;
                    var seriesInstanceUID = instance.SeriesInstanceUID;
                    sopInstanceUIDsToSeriesInstanceUIDMap[sopInstanceUID] =
                        seriesInstanceUID;
                    if (
                        !derivationSourceDatasets.find(function (dsd) {
                            return dsd.SeriesInstanceUID === seriesInstanceUID;
                        })
                    ) {
                        var derivationSourceDataset =
                            MeasurementReport.generateDerivationSourceDataset(
                                instance
                            );
                        derivationSourceDatasets.push(derivationSourceDataset);
                    }
                    var frameNumber = metadataProvider.get(
                        "frameNumber",
                        imageId
                    );
                    var toolData = toolState[imageId];
                    var toolTypes = Object.keys(toolData);
                    var ReferencedSOPSequence = {
                        ReferencedSOPClassUID: sopClassUID,
                        ReferencedSOPInstanceUID: sopInstanceUID,
                        ReferencedFrameNumber: undefined
                    };
                    if (
                        (instance &&
                            instance.NumberOfFrames &&
                            instance.NumberOfFrames > 1) ||
                        Normalizer.isMultiframeSOPClassUID(sopClassUID)
                    ) {
                        ReferencedSOPSequence.ReferencedFrameNumber =
                            frameNumber;
                    }
                    var measurementGroups = [];
                    toolTypes.forEach(function (toolType) {
                        var group = getMeasurementGroup(
                            toolType,
                            toolData,
                            ReferencedSOPSequence,
                            worldToImageCoords
                        );
                        if (group) {
                            measurementGroups.push(group);
                        }
                    });
                    allMeasurementGroups =
                        allMeasurementGroups.concat(measurementGroups);
                });
                var tid1500MeasurementReport = new TID1500MeasurementReport(
                    {
                        TID1501MeasurementGroups: allMeasurementGroups
                    },
                    options
                );
                var report = new StructuredReport(
                    derivationSourceDatasets,
                    options
                );
                var contentItem = tid1500MeasurementReport.contentItem(
                    derivationSourceDatasets,
                    _objectSpread2(
                        _objectSpread2({}, options),
                        {},
                        {
                            sopInstanceUIDsToSeriesInstanceUIDMap:
                                sopInstanceUIDsToSeriesInstanceUIDMap
                        }
                    )
                );
                report.dataset = Object.assign(report.dataset, contentItem);
                report.dataset._meta = _meta;
                report.SpecificCharacterSet = "ISO_IR 192";
                return report;
            }
        },
        {
            key: "generateToolState",
            value: function generateToolState(
                dataset,
                sopInstanceUIDToImageIdMap,
                imageToWorldCoords,
                metadata,
                hooks
            ) {
                if (
                    dataset.ContentTemplateSequence.TemplateIdentifier !==
                    "1500"
                ) {
                    throw new Error(
                        "This package can currently only interpret DICOM SR TID 1500"
                    );
                }
                var REPORT = "Imaging Measurements";
                var GROUP = "Measurement Group";
                var TRACKING_IDENTIFIER = "Tracking Identifier";
                var TRACKING_UNIQUE_IDENTIFIER = "Tracking Unique Identifier";
                var imagingMeasurementContent = toArray(
                    dataset.ContentSequence
                ).find(codeMeaningEquals(REPORT));
                var measurementGroups = toArray(
                    imagingMeasurementContent.ContentSequence
                ).filter(codeMeaningEquals(GROUP));
                var measurementData = {};
                var cornerstoneToolClasses =
                    MeasurementReport.CORNERSTONE_TOOL_CLASSES_BY_UTILITY_TYPE;
                var registeredToolClasses = [];
                Object.keys(cornerstoneToolClasses).forEach(function (key) {
                    registeredToolClasses.push(cornerstoneToolClasses[key]);
                    measurementData[key] = [];
                });
                measurementGroups.forEach(function (measurementGroup) {
                    try {
                        var _hooks$getToolClass;
                        var measurementGroupContentSequence = toArray(
                            measurementGroup.ContentSequence
                        );
                        var TrackingIdentifierGroup =
                            measurementGroupContentSequence.find(function (
                                contentItem
                            ) {
                                return (
                                    contentItem.ConceptNameCodeSequence
                                        .CodeMeaning === TRACKING_IDENTIFIER
                                );
                            });
                        var TrackingIdentifierValue =
                            TrackingIdentifierGroup.TextValue;
                        var TrackingUniqueIdentifierGroup =
                            measurementGroupContentSequence.find(function (
                                contentItem
                            ) {
                                return (
                                    contentItem.ConceptNameCodeSequence
                                        .CodeMeaning ===
                                    TRACKING_UNIQUE_IDENTIFIER
                                );
                            });
                        var TrackingUniqueIdentifierValue =
                            TrackingUniqueIdentifierGroup === null ||
                            TrackingUniqueIdentifierGroup === void 0
                                ? void 0
                                : TrackingUniqueIdentifierGroup.UID;
                        var toolClass =
                            (hooks === null ||
                            hooks === void 0 ||
                            (_hooks$getToolClass = hooks.getToolClass) ===
                                null ||
                            _hooks$getToolClass === void 0
                                ? void 0
                                : _hooks$getToolClass.call(
                                      hooks,
                                      measurementGroup,
                                      dataset,
                                      registeredToolClasses
                                  )) ||
                            registeredToolClasses.find(function (tc) {
                                return tc.isValidCornerstoneTrackingIdentifier(
                                    TrackingIdentifierValue
                                );
                            });
                        if (toolClass) {
                            var measurement = toolClass.getMeasurementData(
                                measurementGroup,
                                sopInstanceUIDToImageIdMap,
                                imageToWorldCoords,
                                metadata
                            );
                            measurement.TrackingUniqueIdentifier =
                                TrackingUniqueIdentifierValue;
                            console.log(
                                "=== ".concat(toolClass.toolType, " ===")
                            );
                            console.log(measurement);
                            measurementData[toolClass.toolType].push(
                                measurement
                            );
                        }
                    } catch (e) {
                        console.warn(
                            "Unable to generate tool state for",
                            measurementGroup,
                            e
                        );
                    }
                });
                return measurementData;
            }
        },
        {
            key: "registerTool",
            value: function registerTool(toolClass) {
                MeasurementReport.CORNERSTONE_TOOL_CLASSES_BY_UTILITY_TYPE[
                    toolClass.utilityToolType
                ] = toolClass;
                MeasurementReport.CORNERSTONE_TOOL_CLASSES_BY_TOOL_TYPE[
                    toolClass.toolType
                ] = toolClass;
                MeasurementReport.MEASUREMENT_BY_TOOLTYPE[toolClass.toolType] =
                    toolClass.utilityToolType;
            }
        }
    ]);
})();
_MeasurementReport = MeasurementReport;
_MeasurementReport.CORNERSTONE_3D_TAG = CORNERSTONE_3D_TAG;
_MeasurementReport.MEASUREMENT_BY_TOOLTYPE = {};
_MeasurementReport.CORNERSTONE_TOOL_CLASSES_BY_UTILITY_TYPE = {};
_MeasurementReport.CORNERSTONE_TOOL_CLASSES_BY_TOOL_TYPE = {};
_MeasurementReport.generateDerivationSourceDataset = function (instance) {
    var _vrMap = {
        PixelData: "OW"
    };
    var _meta = _MeasurementReport.generateDatasetMeta();
    var derivationSourceDataset = _objectSpread2(
        _objectSpread2({}, instance),
        {},
        {
            _meta: _meta,
            _vrMap: _vrMap
        }
    );
    return derivationSourceDataset;
};

export { MeasurementReport as default };
