declare function createLabelmapsFromBufferInternal(
    referencedImageIds: any,
    arrayBuffer: any,
    metadataProvider: any,
    options: any
): Promise<{
    labelMapImages: any[][];
    segMetadata: {
        seriesInstanceUid: any;
        data: any[];
    };
    segmentsOnFrame: any[];
    segmentsOnFrameArray: any[];
    centroids: Map<any, any>;
    overlappingSegments: any;
}>;
export declare function insertPixelDataPlanar(
    segmentsOnFrame: any,
    labelMapImages: any,
    pixelData: any,
    multiframe: any,
    imageIds: any,
    validOrientations: any,
    metadataProvider: any,
    tolerance: any,
    segmentsPixelIndices: any,
    sopUIDImageIdIndexMap: any,
    imageIdMaps: any
): Promise<unknown>;
export { createLabelmapsFromBufferInternal };
