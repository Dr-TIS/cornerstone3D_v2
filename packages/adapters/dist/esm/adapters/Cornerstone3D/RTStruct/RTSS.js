import { objectSpread2 as _objectSpread2 } from "../../../_virtual/_rollupPluginBabelHelpers.js";
import { utilities } from "@cornerstonejs/tools";
import dcmjs from "dcmjs";
import getPatientModule from "./utilities/getPatientModule.js";
import getReferencedFrameOfReferenceSequence from "./utilities/getReferencedFrameOfReferenceSequence.js";
import getReferencedSeriesSequence from "./utilities/getReferencedSeriesSequence.js";
import getRTROIObservationsSequence from "./utilities/getRTROIObservationsSequence.js";
import getRTSeriesModule from "./utilities/getRTSeriesModule.js";
import getStructureSetModule from "./utilities/getStructureSetModule.js";

var _utilities$contours = utilities.contours,
    generateContourSetsFromLabelmap =
        _utilities$contours.generateContourSetsFromLabelmap,
    AnnotationToPointData = _utilities$contours.AnnotationToPointData;
var DicomMetaDictionary = dcmjs.data.DicomMetaDictionary;
function generateRTSSFromSegmentations(
    segmentations,
    metadataProvider,
    DicomMetadataStore
) {
    var roiContours = [];
    var contourSets = generateContourSetsFromLabelmap({
        segmentations: segmentations
    });
    contourSets.forEach(function (contourSet, segIndex) {
        if (contourSet) {
            var contourSequence = [];
            contourSet.sliceContours.forEach(function (sliceContour) {
                var sopCommon = metadataProvider.get(
                    "sopCommonModule",
                    sliceContour.referencedImageId
                );
                var ReferencedSOPClassUID = sopCommon.sopClassUID;
                var ReferencedSOPInstanceUID = sopCommon.sopInstanceUID;
                var ContourImageSequence = [
                    {
                        ReferencedSOPClassUID: ReferencedSOPClassUID,
                        ReferencedSOPInstanceUID: ReferencedSOPInstanceUID
                    }
                ];
                var sliceContourPolyData = sliceContour.polyData;
                sliceContour.contours.forEach(function (contour, index) {
                    var ContourGeometricType = contour.type;
                    var NumberOfContourPoints = contour.contourPoints.length;
                    var ContourData = [];
                    contour.contourPoints.forEach(function (point) {
                        var pointData = sliceContourPolyData.points[point];
                        pointData[0] = +pointData[0].toFixed(2);
                        pointData[1] = +pointData[1].toFixed(2);
                        pointData[2] = +pointData[2].toFixed(2);
                        ContourData.push(pointData[0]);
                        ContourData.push(pointData[1]);
                        ContourData.push(pointData[2]);
                    });
                    contourSequence.push({
                        ContourImageSequence: ContourImageSequence,
                        ContourGeometricType: ContourGeometricType,
                        NumberOfContourPoints: NumberOfContourPoints,
                        ContourNumber: index + 1,
                        ContourData: ContourData
                    });
                });
            });
            var segLabel = contourSet.label || "Segment ".concat(segIndex + 1);
            var ROIContour = {
                name: segLabel,
                description: segLabel,
                contourSequence: contourSequence,
                color: contourSet.color,
                metadata: contourSet.metadata
            };
            roiContours.push(ROIContour);
        }
    });
    var rtMetadata = {
        name: segmentations.label,
        label: segmentations.label
    };
    var dataset = _initializeDataset(
        rtMetadata,
        roiContours[0].metadata,
        metadataProvider
    );
    roiContours.forEach(function (contour, index) {
        var roiContour = {
            ROIDisplayColor: contour.color || [255, 0, 0],
            ContourSequence: contour.contourSequence,
            ReferencedROINumber: index + 1
        };
        dataset.StructureSetROISequence.push(
            getStructureSetModule(contour, index)
        );
        dataset.ROIContourSequence.push(roiContour);
        dataset.ReferencedSeriesSequence = getReferencedSeriesSequence(
            contour.metadata,
            index,
            metadataProvider,
            DicomMetadataStore
        );
        dataset.ReferencedFrameOfReferenceSequence =
            getReferencedFrameOfReferenceSequence(
                contour.metadata,
                metadataProvider,
                dataset
            );
    });
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
    dataset._meta = _meta;
    dataset.SpecificCharacterSet = "ISO_IR 192";
    return dataset;
}
function generateRTSSFromAnnotations(
    annotations,
    metadataProvider,
    DicomMetadataStore
) {
    var rtMetadata = {
        name: "RTSS from Annotations",
        label: "RTSS from Annotations"
    };
    var dataset = _initializeDataset(
        rtMetadata,
        annotations[0].metadata,
        metadataProvider
    );
    annotations.forEach(function (annotation, index) {
        var ContourSequence = AnnotationToPointData.convert(
            annotation,
            index,
            metadataProvider
        );
        dataset.StructureSetROISequence.push(
            getStructureSetModule(annotation, index)
        );
        dataset.ROIContourSequence.push(ContourSequence);
        dataset.RTROIObservationsSequence.push(
            getRTROIObservationsSequence(annotation, index)
        );
        dataset.ReferencedSeriesSequence = getReferencedSeriesSequence(
            annotation.metadata,
            index,
            metadataProvider,
            DicomMetadataStore
        );
        dataset.ReferencedFrameOfReferenceSequence =
            getReferencedFrameOfReferenceSequence(
                annotation.metadata,
                metadataProvider,
                dataset
            );
    });
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
    dataset._meta = _meta;
    dataset.SpecificCharacterSet = "ISO_IR 192";
    return dataset;
}
function _initializeDataset(rtMetadata, imgMetadata, metadataProvider) {
    var rtSOPInstanceUID = DicomMetaDictionary.uid();
    var imageId = imgMetadata.referencedImageId,
        FrameOfReferenceUID = imgMetadata.FrameOfReferenceUID;
    var _metadataProvider$get = metadataProvider.get(
            "generalSeriesModule",
            imageId
        ),
        studyInstanceUID = _metadataProvider$get.studyInstanceUID;
    var patientModule = getPatientModule(imageId, metadataProvider);
    var rtSeriesModule = getRTSeriesModule(DicomMetaDictionary);
    return _objectSpread2(
        _objectSpread2(
            _objectSpread2(
                {
                    StructureSetROISequence: [],
                    ROIContourSequence: [],
                    RTROIObservationsSequence: [],
                    ReferencedSeriesSequence: [],
                    ReferencedFrameOfReferenceSequence: []
                },
                patientModule
            ),
            rtSeriesModule
        ),
        {},
        {
            StudyInstanceUID: studyInstanceUID,
            SOPClassUID: "1.2.840.10008.5.1.4.1.1.481.3",
            SOPInstanceUID: rtSOPInstanceUID,
            Manufacturer: "dcmjs",
            Modality: "RTSTRUCT",
            FrameOfReferenceUID: FrameOfReferenceUID,
            PositionReferenceIndicator: "",
            StructureSetLabel: rtMetadata.label || "",
            StructureSetName: rtMetadata.name || "",
            ReferringPhysicianName: "",
            OperatorsName: "",
            StructureSetDate: DicomMetaDictionary.date(),
            StructureSetTime: DicomMetaDictionary.time(),
            _meta: null
        }
    );
}

export { generateRTSSFromAnnotations, generateRTSSFromSegmentations };
