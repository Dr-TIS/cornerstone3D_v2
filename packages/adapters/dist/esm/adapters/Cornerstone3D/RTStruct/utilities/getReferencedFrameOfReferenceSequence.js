import { toConsumableArray as _toConsumableArray } from "../../../../_virtual/_rollupPluginBabelHelpers.js";

function getReferencedFrameOfReferenceSequence(
    metadata,
    metadataProvider,
    dataset
) {
    var imageId = metadata.referencedImageId,
        FrameOfReferenceUID = metadata.FrameOfReferenceUID;
    var instance = metadataProvider.get("instance", imageId);
    var SeriesInstanceUID = instance.SeriesInstanceUID;
    var ReferencedSeriesSequence = dataset.ReferencedSeriesSequence;
    return [
        {
            FrameOfReferenceUID: FrameOfReferenceUID,
            RTReferencedStudySequence: [
                {
                    ReferencedSOPClassUID: dataset.SOPClassUID,
                    ReferencedSOPInstanceUID: dataset.SOPInstanceUID,
                    RTReferencedSeriesSequence: [
                        {
                            SeriesInstanceUID: SeriesInstanceUID,
                            ContourImageSequence: _toConsumableArray(
                                ReferencedSeriesSequence[0]
                                    .ReferencedInstanceSequence
                            )
                        }
                    ]
                }
            ]
        }
    ];
}

export { getReferencedFrameOfReferenceSequence as default };
