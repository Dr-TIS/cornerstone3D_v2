function generateLabelMaps2DFrom3D(labelmap3D) {
    var scalarData = labelmap3D.scalarData,
        dimensions = labelmap3D.dimensions;
    var labelmaps2D = [];
    var segmentsOnLabelmap3D = new Set();
    for (var z = 0; z < dimensions[2]; z++) {
        var pixelData = scalarData.slice(
            z * dimensions[0] * dimensions[1],
            (z + 1) * dimensions[0] * dimensions[1]
        );
        var segmentsOnLabelmap = [];
        for (var i = 0; i < pixelData.length; i++) {
            var segment = pixelData[i];
            if (!segmentsOnLabelmap.includes(segment) && segment !== 0) {
                segmentsOnLabelmap.push(segment);
            }
        }
        var labelmap2D = {
            segmentsOnLabelmap: segmentsOnLabelmap,
            pixelData: pixelData,
            rows: dimensions[1],
            columns: dimensions[0]
        };
        if (segmentsOnLabelmap.length === 0) {
            continue;
        }
        segmentsOnLabelmap.forEach(function (segmentIndex) {
            segmentsOnLabelmap3D.add(segmentIndex);
        });
        labelmaps2D[dimensions[2] - 1 - z] = labelmap2D;
    }
    labelmap3D.segmentsOnLabelmap = Array.from(segmentsOnLabelmap3D);
    labelmap3D.labelmaps2D = labelmaps2D;
    return labelmap3D;
}

export { generateLabelMaps2DFrom3D };
