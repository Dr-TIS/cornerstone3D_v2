import openJpegFactory from '@cornerstonejs/codec-openjpeg/decodewasmjs';
const openjpegWasm = new URL('@cornerstonejs/codec-openjpeg/decodewasm', import.meta.url);
const local = {
    codec: undefined,
    decoder: undefined,
    decodeConfig: {},
};
export function initialize(decodeConfig) {
    local.decodeConfig = decodeConfig;
    if (local.codec) {
        return Promise.resolve();
    }
    const openJpegModule = openJpegFactory({
        locateFile: (f) => {
            if (f.endsWith('.wasm')) {
                return openjpegWasm.toString();
            }
            return f;
        },
    });
    return new Promise((resolve, reject) => {
        openJpegModule.then((instance) => {
            local.codec = instance;
            local.decoder = new instance.J2KDecoder();
            resolve();
        }, reject);
    });
}
async function decodeAsync(compressedImageFrame, imageInfo) {
    await initialize();
    const decoder = local.decoder;
    const encodedBufferInWASM = decoder.getEncodedBuffer(compressedImageFrame.length);
    encodedBufferInWASM.set(compressedImageFrame);
    decoder.decode();
    const frameInfo = decoder.getFrameInfo();
    const decodedBufferInWASM = decoder.getDecodedBuffer();
    const dicomIsSigned = imageInfo?.pixelRepresentation === 1;
    const bitsStored = imageInfo?.bitsStored;
    const effectiveIsSigned = imageInfo?.pixelRepresentation !== undefined
        ? dicomIsSigned
        : frameInfo.isSigned;
    if (frameInfo.isSigned &&
        imageInfo?.pixelRepresentation === 0 &&
        bitsStored &&
        bitsStored < 16) {
        const mask = (1 << bitsStored) - 1;
        if (frameInfo.bitsPerSample > 8) {
            const view = new Uint16Array(decodedBufferInWASM.buffer, decodedBufferInWASM.byteOffset, decodedBufferInWASM.byteLength / 2);
            for (let i = 0; i < view.length; i++) {
                view[i] = view[i] & mask;
            }
        }
        else {
            for (let i = 0; i < decodedBufferInWASM.length; i++) {
                decodedBufferInWASM[i] = decodedBufferInWASM[i] & mask;
            }
        }
    }
    const imageOffset = `x: ${decoder.getImageOffset().x}, y: ${decoder.getImageOffset().y}`;
    const numDecompositions = decoder.getNumDecompositions();
    const numLayers = decoder.getNumLayers();
    const progessionOrder = ['unknown', 'LRCP', 'RLCP', 'RPCL', 'PCRL', 'CPRL'][decoder.getProgressionOrder() + 1];
    const reversible = decoder.getIsReversible();
    const blockDimensions = `${decoder.getBlockDimensions().width} x ${decoder.getBlockDimensions().height}`;
    const tileSize = `${decoder.getTileSize().width} x ${decoder.getTileSize().height}`;
    const tileOffset = `${decoder.getTileOffset().x}, ${decoder.getTileOffset().y}`;
    const colorTransform = decoder.getColorSpace();
    const decodedSize = `${decodedBufferInWASM.length.toLocaleString()} bytes`;
    const compressionRatio = `${(decodedBufferInWASM.length / encodedBufferInWASM.length).toFixed(2)}:1`;
    const encodedImageInfo = {
        columns: frameInfo.width,
        rows: frameInfo.height,
        bitsPerPixel: frameInfo.bitsPerSample,
        signed: effectiveIsSigned,
        bytesPerPixel: imageInfo.bytesPerPixel,
        componentsPerPixel: frameInfo.componentCount,
    };
    let pixelData = getPixelData(frameInfo, decodedBufferInWASM, effectiveIsSigned);
    const { buffer: b, byteOffset, byteLength } = pixelData;
    const pixelDataArrayBuffer = b.slice(byteOffset, byteOffset + byteLength);
    pixelData = new pixelData.constructor(pixelDataArrayBuffer);
    const encodeOptions = {
        imageOffset,
        numDecompositions,
        numLayers,
        progessionOrder,
        reversible,
        blockDimensions,
        tileSize,
        tileOffset,
        colorTransform,
        decodedSize,
        compressionRatio,
    };
    return {
        ...imageInfo,
        pixelData,
        imageInfo: encodedImageInfo,
        encodeOptions,
        ...encodeOptions,
        ...encodedImageInfo,
    };
}
function getPixelData(frameInfo, decodedBuffer, isSigned = frameInfo.isSigned) {
    if (frameInfo.bitsPerSample > 8) {
        if (isSigned) {
            return new Int16Array(decodedBuffer.buffer, decodedBuffer.byteOffset, decodedBuffer.byteLength / 2);
        }
        return new Uint16Array(decodedBuffer.buffer, decodedBuffer.byteOffset, decodedBuffer.byteLength / 2);
    }
    if (isSigned) {
        return new Int8Array(decodedBuffer.buffer, decodedBuffer.byteOffset, decodedBuffer.byteLength);
    }
    return new Uint8Array(decodedBuffer.buffer, decodedBuffer.byteOffset, decodedBuffer.byteLength);
}
export default decodeAsync;
