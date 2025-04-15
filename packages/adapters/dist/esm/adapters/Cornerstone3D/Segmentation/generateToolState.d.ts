declare function generateToolState(
    imageIds: any,
    arrayBuffer: any,
    metadataProvider: any,
    skipOverlapping?: boolean,
    tolerance?: number,
    cs3dVersion?: number
): any;
declare function createFromDICOMSegBuffer(
    referencedImageIds: any,
    arrayBuffer: any,
    {
        metadataProvider,
        skipOverlapping,
        tolerance
    }: {
        metadataProvider: any;
        skipOverlapping?: boolean;
        tolerance?: number;
    }
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
export { generateToolState, createFromDICOMSegBuffer };
