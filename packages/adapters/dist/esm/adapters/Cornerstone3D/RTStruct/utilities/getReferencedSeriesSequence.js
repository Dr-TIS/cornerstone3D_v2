function getReferencedSeriesSequence(
    metadata,
    _index,
    metadataProvider,
    DicomMetadataStore
) {
    // grab imageId from toolData
    var imageId = metadata.referencedImageId;
    var instance = metadataProvider.get("instance", imageId);
    var SeriesInstanceUID = instance.SeriesInstanceUID,
        StudyInstanceUID = instance.StudyInstanceUID;
    var ReferencedSeriesSequence = [];
    if (SeriesInstanceUID) {
        var series = DicomMetadataStore.getSeries(
            StudyInstanceUID,
            SeriesInstanceUID
        );
        var ReferencedSeries = {
            SeriesInstanceUID: SeriesInstanceUID,
            ReferencedInstanceSequence: []
        };
        series.instances.forEach(function (instance) {
            var SOPInstanceUID = instance.SOPInstanceUID,
                SOPClassUID = instance.SOPClassUID;
            ReferencedSeries.ReferencedInstanceSequence.push({
                ReferencedSOPClassUID: SOPClassUID,
                ReferencedSOPInstanceUID: SOPInstanceUID
            });
        });
        ReferencedSeriesSequence.push(ReferencedSeries);
    }
    return ReferencedSeriesSequence;
}

export { getReferencedSeriesSequence as default };
