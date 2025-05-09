const local = {
    jpeg: undefined,
    decodeConfig: {},
};
export function initialize(decodeConfig) {
    local.decodeConfig = decodeConfig;
    if (local.jpeg) {
        return Promise.resolve();
    }
    return new Promise((resolve, reject) => {
        import('../../codecs/jpegLossless').then((jpeg) => {
            local.jpeg = jpeg;
            resolve();
        }, reject);
    });
}
async function decodeJPEGLossless(imageFrame, pixelData) {
    await initialize();
    if (typeof local.jpeg === 'undefined' ||
        typeof local.jpeg.lossless === 'undefined' ||
        typeof local.jpeg.lossless.Decoder === 'undefined') {
        throw new Error('No JPEG Lossless decoder loaded');
    }
    const byteOutput = imageFrame.bitsAllocated <= 8 ? 1 : 2;
    const buffer = pixelData.buffer;
    const decoder = new local.jpeg.lossless.Decoder();
    const decompressedData = decoder.decode(buffer, pixelData.byteOffset, pixelData.length, byteOutput);
    if (imageFrame.pixelRepresentation === 0) {
        if (imageFrame.bitsAllocated === 16) {
            imageFrame.pixelData = new Uint16Array(decompressedData.buffer);
            return imageFrame;
        }
        imageFrame.pixelData = new Uint8Array(decompressedData.buffer);
        return imageFrame;
    }
    imageFrame.pixelData = new Int16Array(decompressedData.buffer);
    return imageFrame;
}
export default decodeJPEGLossless;
