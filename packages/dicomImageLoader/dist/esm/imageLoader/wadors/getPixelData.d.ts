import type { CornerstoneWadoRsLoaderOptions } from './loadImage';
declare function getPixelData(uri: string, imageId: string, mediaType?: string, options?: CornerstoneWadoRsLoaderOptions): import("@cornerstonejs/core/utilities/ProgressiveIterator").PromiseIterator<unknown> | import("../../types").LoaderXhrRequestPromise<{
    contentType: string;
    pixelData: Uint8Array;
    imageQualityStatus: import("@cornerstonejs/core/enums").ImageQualityStatus;
    percentComplete: number;
}> | Promise<{
    contentType: string;
    imageQualityStatus: import("@cornerstonejs/core/enums").ImageQualityStatus;
    pixelData: Uint8Array;
    extractDone?: undefined;
    tokenIndex?: undefined;
    responseHeaders?: undefined;
    boundary?: undefined;
    multipartContentType?: undefined;
} | {
    contentType: any;
    extractDone: boolean;
    tokenIndex: any;
    responseHeaders: any;
    boundary: any;
    multipartContentType: any;
    pixelData: any;
    imageQualityStatus?: undefined;
}>;
export default getPixelData;
