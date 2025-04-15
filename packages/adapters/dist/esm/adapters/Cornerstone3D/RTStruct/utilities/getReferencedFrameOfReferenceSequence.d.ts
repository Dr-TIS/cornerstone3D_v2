export default function getReferencedFrameOfReferenceSequence(
    metadata: any,
    metadataProvider: any,
    dataset: any
): {
    FrameOfReferenceUID: any;
    RTReferencedStudySequence: {
        ReferencedSOPClassUID: any;
        ReferencedSOPInstanceUID: any;
        RTReferencedSeriesSequence: {
            SeriesInstanceUID: any;
            ContourImageSequence: any[];
        }[];
    }[];
}[];
