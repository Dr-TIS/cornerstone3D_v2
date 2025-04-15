export namespace ComponentSpec {
    let hSamp: number;
    let quantTableSel: number;
    let vSamp: number;
}
export var DataStream: {
    new (data: any, offset: any, length: any): {
        buffer: Uint8Array;
        index: number;
        get16(): number;
        get8(): number;
    };
};
export var Decoder: {
    new (buffer: any, numBytes: any): {
        buffer: any;
        stream: any;
        frame: {
            dimX: number;
            dimY: number;
            numComp: number;
            precision: number;
            components: any[];
            read(data: any): number;
        };
        huffTable: {
            l: any;
            th: number[];
            v: any;
            tc: number[][];
            read(data: any, HuffTab: any): number;
            buildHuffTable(tab: any, L: any, V: any): void;
        };
        quantTable: {
            precision: any[];
            tq: number[];
            quantTables: any;
            read(data: any, table: any): number;
        };
        scan: {
            ah: number;
            al: number;
            numComp: number;
            selection: number;
            spectralEnd: number;
            components: any[];
            read(data: any): number;
        };
        DU: any;
        HuffTab: any;
        IDCT_Source: any[];
        nBlock: any[];
        acTab: any;
        dcTab: any;
        qTab: any;
        marker: number;
        markerIndex: number;
        numComp: number;
        restartInterval: number;
        selection: number;
        xDim: number;
        yDim: number;
        xLoc: number;
        yLoc: number;
        outputData: any;
        restarting: boolean;
        mask: number;
        numBytes: number;
        precision: any;
        components: any[];
        getter: any;
        setter: any;
        output: any;
        selector: any;
        decompress(buffer: any, offset: any, length: any): any;
        decode(buffer: any, offset: any, length: any, numBytes: any): any;
        decodeUnit(prev: any, temp: any, index: any): number;
        select1(compOffset: any): any;
        select2(compOffset: any): any;
        select3(compOffset: any): any;
        select4(compOffset: any): number;
        select5(compOffset: any): any;
        select6(compOffset: any): any;
        select7(compOffset: any): number;
        decodeRGB(prev: any, temp: any, index: any): number;
        decodeSingle(prev: any, temp: any, index: any): number;
        getHuffmanValue(table: any, temp: any, index: any): number;
        getn(PRED: any, n: any, temp: any, index: any): number;
        getPreviousX(compOffset?: number): any;
        getPreviousXY(compOffset?: number): any;
        getPreviousY(compOffset?: number): any;
        isLastPixel(): boolean;
        outputSingle(PRED: any): void;
        outputRGB(PRED: any): void;
        setValue8(index: any, val: any): void;
        getValue8(index: any): any;
        setValueRGB(index: any, val: any, compOffset?: number): void;
        getValueRGB(index: any, compOffset: any): any;
        readApp(): any;
        readComment(): string;
        readNumber(): any;
    };
    IDCT_P: number[];
    TABLE: number[];
    MAX_HUFFMAN_SUBTREE: number;
    MSB: number;
    RESTART_MARKER_BEGIN: number;
    RESTART_MARKER_END: number;
};
export var FrameHeader: {
    new (): {
        dimX: number;
        dimY: number;
        numComp: number;
        precision: number;
        components: any[];
        read(data: any): number;
    };
};
export var HuffmanTable: {
    new (): {
        l: any;
        th: number[];
        v: any;
        tc: number[][];
        read(data: any, HuffTab: any): number;
        buildHuffTable(tab: any, L: any, V: any): void;
    };
    MSB: number;
};
export var QuantizationTable: {
    new (): {
        precision: any[];
        tq: number[];
        quantTables: any;
        read(data: any, table: any): number;
    };
    enhanceQuantizationTable: (qtab: any, table: any) => void;
};
export namespace ScanComponent {
    let acTabSel: number;
    let dcTabSel: number;
    let scanCompSel: number;
}
export var ScanHeader: {
    new (): {
        ah: number;
        al: number;
        numComp: number;
        selection: number;
        spectralEnd: number;
        components: any[];
        read(data: any): number;
    };
};
declare var utils_exports: {};
export { utils_exports as Utils };
