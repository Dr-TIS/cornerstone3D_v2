export default function getReferencedSeriesSequence(
    metadata: any,
    _index: any,
    metadataProvider: any,
    DicomMetadataStore: any
): {
    SeriesInstanceUID: any;
    ReferencedInstanceSequence: any[];
}[];
