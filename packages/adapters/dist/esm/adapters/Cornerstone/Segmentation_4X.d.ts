export function generateSegmentation(
    images: object[],
    inputLabelmaps3D: any | any[],
    userOptions?: any
): Blob;
export function fillSegmentation(
    segmentation: any,
    inputLabelmaps3D: any,
    userOptions?: {}
): object;
export function _getLabelmapsFromReferencedFrameIndicies(
    labelmap3D: any,
    referencedFrameIndicies: any
): any[];
export function _createSegFromImages(
    images: any[],
    isMultiframe: boolean,
    options: any
): any;
export function generateToolState(
    referencedImageIds: string[],
    arrayBuffer: ArrayBuffer,
    metadataProvider: any,
    options: obj
): [];
export function findReferenceSourceImageId(
    multiframe: any,
    frameSegment: Int,
    imageIds: string[],
    metadataProvider: any,
    tolerance: Float,
    sopUIDImageIdIndexMap: any
): string;
export function checkSEGsOverlapping(
    pixelData: any,
    multiframe: any,
    imageIds: any,
    validOrientations: any,
    metadataProvider: any,
    tolerance: any,
    TypedArrayConstructor: any,
    sopUIDImageIdIndexMap: any
): boolean;
export function insertOverlappingPixelDataPlanar(
    segmentsOnFrame: any,
    segmentsOnFrameArray: any,
    labelmapBufferArray: any,
    pixelData: any,
    multiframe: any,
    imageIds: any,
    validOrientations: any,
    metadataProvider: any,
    tolerance: any,
    TypedArrayConstructor: any,
    segmentsPixelIndices: any,
    sopUIDImageIdIndexMap: any
): void;
export function insertPixelDataPlanar(
    segmentsOnFrame: any,
    segmentsOnFrameArray: any,
    labelmapBufferArray: any,
    pixelData: any,
    multiframe: any,
    imageIds: any,
    validOrientations: any,
    metadataProvider: any,
    tolerance: any,
    TypedArrayConstructor: any,
    segmentsPixelIndices: any,
    sopUIDImageIdIndexMap: any,
    imageIdMaps: any,
    eventTarget: any,
    triggerEvent: any
): Promise<any>;
export function unpackPixelData(multiframe: any, options: any): Uint8Array;
export function getUnpackedChunks(data: any, maxBytesPerChunk: any): any[];
export function getImageIdOfSourceImageBySourceImageSequence(
    SourceImageSequence: any,
    sopUIDImageIdIndexMap: any
): string;
export function getImageIdOfSourceImagebyGeometry(
    ReferencedSeriesInstanceUID: string,
    FrameOfReferenceUID: string,
    PerFrameFunctionalGroup: any,
    imageIds: string[],
    metadataProvider: any,
    tolerance: Float
): string;
export function getImageIdOfReferencedFrame(
    sopInstanceUid: string,
    frameNumber: number,
    sopUIDImageIdIndexMap: any
): string;
export function getValidOrientations(iop: any): any;
export function alignPixelDataWithSourceData(
    pixelData2D: Ndarray,
    iop: any,
    orientations: any,
    tolerance: any
): Ndarray;
export function getSegmentMetadata(
    multiframe: any,
    seriesInstanceUid: any
): {
    seriesInstanceUid: any;
    data: any[];
};
export function readFromUnpackedChunks(
    chunks: ArrayBuffer[],
    offset: number,
    length: number
): Uint8Array;
export function getUnpackedOffsetAndLength(
    chunks: any,
    offset: any,
    length: any
): {
    start: {
        chunkIndex: number;
        offset: any;
    };
    end: {
        chunkIndex: number;
        offset: any;
    };
};
export function calculateCentroid(
    imageIdIndexBufferIndex: any,
    multiframe: any,
    metadataProvider: any,
    imageIds: any
): {
    image: {
        x: number;
        y: number;
        z: number;
    };
    world: {
        x: number;
        y: number;
        z: number;
    };
    count: number;
};
export function getSegmentIndex(multiframe: any, frame: any): any;
export default Segmentation;
export type BrushData = {
    toolState: any;
    segments: any[];
};
declare namespace Segmentation {
    export { generateSegmentation };
    export { generateToolState };
    export { fillSegmentation };
}
