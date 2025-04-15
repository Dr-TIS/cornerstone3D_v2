declare function generateToolState(
    imageIds: any,
    arrayBuffer: any,
    metadataProvider: any,
    tolerance?: number
): Promise<{
    pixelData: any;
}>;
declare const ParametricMapObj: {
    generateToolState: typeof generateToolState;
};
export { ParametricMapObj as default, ParametricMapObj as ParametricMap };
