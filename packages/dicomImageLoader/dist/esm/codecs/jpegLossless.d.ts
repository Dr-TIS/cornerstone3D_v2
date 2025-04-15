declare namespace w {
    let hSamp: number;
    let quantTableSel: number;
    let vSamp: number;
}
declare var b: {
    new (t: any, e: any, r: any): {
        buffer: Uint8Array;
        index: number;
        get16(): number;
        get8(): number;
    };
};
declare var E: {
    new (t: any, e: any): {
        buffer: any;
        stream: any;
        frame: {
            dimX: number;
            dimY: number;
            numComp: number;
            precision: number;
            components: any[];
            read(t: any): number;
        };
        huffTable: {
            l: any;
            th: number[];
            v: any;
            tc: number[][];
            read(t: any, e: any): number;
            buildHuffTable(t: any, e: any, r: any): void;
        };
        quantTable: {
            precision: any[];
            tq: number[];
            quantTables: any;
            read(t: any, e: any): number;
        };
        scan: {
            ah: number;
            al: number;
            numComp: number;
            selection: number;
            spectralEnd: number;
            components: any[];
            read(t: any): number;
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
        decompress(t: any, e: any, r: any): any;
        decode(t: any, e: any, r: any, o: any): any;
        decodeUnit(t: any, e: any, r: any): number;
        select1(t: any): any;
        select2(t: any): any;
        select3(t: any): any;
        select4(t: any): number;
        select5(t: any): any;
        select6(t: any): any;
        select7(t: any): number;
        decodeRGB(t: any, e: any, r: any): number;
        decodeSingle(t: any, e: any, r: any): number;
        getHuffmanValue(t: any, e: any, r: any): number;
        getn(t: any, e: any, r: any, o: any): number;
        getPreviousX(t?: number): any;
        getPreviousXY(t?: number): any;
        getPreviousY(t?: number): any;
        isLastPixel(): boolean;
        outputSingle(t: any): void;
        outputRGB(t: any): void;
        setValue8(t: any, e: any): void;
        getValue8(t: any): any;
        setValueRGB(t: any, e: any, r?: number): void;
        getValueRGB(t: any, e: any): any;
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
declare var x: {
    new (): {
        dimX: number;
        dimY: number;
        numComp: number;
        precision: number;
        components: any[];
        read(t: any): number;
    };
};
declare var p: {
    new (): {
        l: any;
        th: number[];
        v: any;
        tc: number[][];
        read(t: any, e: any): number;
        buildHuffTable(t: any, e: any, r: any): void;
    };
    MSB: number;
};
declare var d: {
    new (): {
        precision: any[];
        tq: number[];
        quantTables: any;
        read(t: any, e: any): number;
    };
    enhanceQuantizationTable: (t: any, e: any) => void;
};
declare namespace R {
    let acTabSel: number;
    let dcTabSel: number;
    let scanCompSel: number;
}
declare var g: {
    new (): {
        ah: number;
        al: number;
        numComp: number;
        selection: number;
        spectralEnd: number;
        components: any[];
        read(t: any): number;
    };
};
declare var k: {};
export { w as ComponentSpec, b as DataStream, E as Decoder, x as FrameHeader, p as HuffmanTable, d as QuantizationTable, R as ScanComponent, g as ScanHeader, k as Utils };
