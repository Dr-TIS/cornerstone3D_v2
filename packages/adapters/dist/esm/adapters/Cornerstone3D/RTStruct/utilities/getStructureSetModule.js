function getStructureSetModule(contour, index) {
    var FrameOfReferenceUID = contour.metadata.FrameOfReferenceUID;
    return {
        ROINumber: index + 1,
        ROIName: contour.name || "Todo: name ".concat(index + 1),
        ROIDescription: "Todo: description ".concat(index + 1),
        ROIGenerationAlgorithm: "Todo: algorithm",
        ReferencedFrameOfReferenceUID: FrameOfReferenceUID
    };
}

export { getStructureSetModule as default };
