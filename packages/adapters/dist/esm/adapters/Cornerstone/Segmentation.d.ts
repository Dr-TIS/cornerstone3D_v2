export function generateSegmentation(
    images: object[],
    labelmaps3DorBrushData: any | any[],
    options?: {
        includeSliceSpacing: boolean;
    },
    cornerstoneToolsVersion?: number
): any;
export function generateToolState(
    imageIds: string[],
    arrayBuffer: ArrayBuffer,
    metadataProvider: any,
    skipOverlapping?: boolean,
    tolerance?: number,
    cornerstoneToolsVersion?: number
): any;
export function fillSegmentation(
    segmentation: object[],
    inputLabelmaps3D: any | any[],
    options?: {
        includeSliceSpacing: boolean;
    },
    cornerstoneToolsVersion?: number
): Blob;
