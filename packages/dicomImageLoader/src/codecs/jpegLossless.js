var S = Object.defineProperty;
var A = (a, t) => {
  for (var e in t) {
    S(a, e, { get: t[e], enumerable: !0 });
  }
};
var w = { hSamp: 0, quantTableSel: 0, vSamp: 0 };
var b = class {
  buffer;
  index;
  constructor(t, e, r) {
    (this.buffer = new Uint8Array(t, e, r)), (this.index = 0);
  }
  get16() {
    let t = (this.buffer[this.index] << 8) + this.buffer[this.index + 1];
    return (this.index += 2), t;
  }
  get8() {
    let t = this.buffer[this.index];
    return (this.index += 1), t;
  }
};
var x = class {
  dimX = 0;
  dimY = 0;
  numComp = 0;
  precision = 0;
  components = [];
  read(t) {
    let e = 0,
      r,
      o = t.get16();
    (e += 2),
      (this.precision = t.get8()),
      (e += 1),
      (this.dimY = t.get16()),
      (e += 2),
      (this.dimX = t.get16()),
      (e += 2),
      (this.numComp = t.get8()),
      (e += 1);
    for (let s = 1; s <= this.numComp; s += 1) {
      if (e > o) {
        throw new Error('ERROR: frame format error');
      }
      let i = t.get8();
      if (((e += 1), e >= o)) {
        throw new Error('ERROR: frame format error [c>=Lf]');
      }
      (r = t.get8()),
        (e += 1),
        this.components[i] || (this.components[i] = { ...w }),
        (this.components[i].hSamp = r >> 4),
        (this.components[i].vSamp = r & 15),
        (this.components[i].quantTableSel = t.get8()),
        (e += 1);
    }
    if (e !== o) {
      throw new Error('ERROR: frame format error [Lf!=count]');
    }
    return 1;
  }
};
var k = {};
A(k, {
  crc32: () => L,
  crcTable: () => T,
  createArray: () => c,
  makeCRCTable: () => y,
});
var c = (...a) => {
    if (a.length > 1) {
      let t = a[0],
        e = a.slice(1),
        r = [];
      for (let o = 0; o < t; o++) {
        r[o] = c(...e);
      }
      return r;
    } else {
      return Array(a[0]).fill(void 0);
    }
  },
  y = function () {
    let a,
      t = [];
    for (let e = 0; e < 256; e++) {
      a = e;
      for (let r = 0; r < 8; r++) {
        a = a & 1 ? 3988292384 ^ (a >>> 1) : a >>> 1;
      }
      t[e] = a;
    }
    return t;
  },
  T = y(),
  L = function (a) {
    let t = new Uint8Array(a),
      e = -1;
    for (let r = 0; r < t.length; r++) {
      e = (e >>> 8) ^ T[(e ^ t[r]) & 255];
    }
    return (e ^ -1) >>> 0;
  };
var p = class a {
  static MSB = 2147483648;
  l;
  th;
  v;
  tc;
  constructor() {
    (this.l = c(4, 2, 16)),
      (this.th = [0, 0, 0, 0]),
      (this.v = c(4, 2, 16, 200)),
      (this.tc = [
        [0, 0],
        [0, 0],
        [0, 0],
        [0, 0],
      ]);
  }
  read(t, e) {
    let r = 0,
      o,
      s,
      i,
      n,
      f,
      u = t.get16();
    for (r += 2; r < u; ) {
      if (((o = t.get8()), (r += 1), (s = o & 15), s > 3)) {
        throw new Error('ERROR: Huffman table ID > 3');
      }
      if (((i = o >> 4), i > 2)) {
        throw new Error('ERROR: Huffman table [Table class > 2 ]');
      }
      for (this.th[s] = 1, this.tc[s][i] = 1, n = 0; n < 16; n += 1) {
        (this.l[s][i][n] = t.get8()), (r += 1);
      }
      for (n = 0; n < 16; n += 1) {
        for (f = 0; f < this.l[s][i][n]; f += 1) {
          if (r > u) {
            throw new Error('ERROR: Huffman table format error [count>Lh]');
          }
          (this.v[s][i][n][f] = t.get8()), (r += 1);
        }
      }
    }
    if (r !== u) {
      throw new Error('ERROR: Huffman table format error [count!=Lf]');
    }
    for (n = 0; n < 4; n += 1) {
      for (f = 0; f < 2; f += 1) {
        this.tc[n][f] !== 0 &&
          this.buildHuffTable(e[n][f], this.l[n][f], this.v[n][f]);
      }
    }
    return 1;
  }
  buildHuffTable(t, e, r) {
    let o, s, i, n, f;
    for (s = 0, i = 0; i < 8; i += 1) {
      for (n = 0; n < e[i]; n += 1) {
        for (f = 0; f < 256 >> (i + 1); f += 1) {
          (t[s] = r[i][n] | ((i + 1) << 8)), (s += 1);
        }
      }
    }
    for (i = 1; s < 256; i += 1, s += 1) {
      t[s] = i | a.MSB;
    }
    for (o = 1, s = 0, i = 8; i < 16; i += 1) {
      for (n = 0; n < e[i]; n += 1) {
        for (f = 0; f < 256 >> (i - 7); f += 1) {
          (t[o * 256 + s] = r[i][n] | ((i + 1) << 8)), (s += 1);
        }
        if (s >= 256) {
          if (s > 256) {
            throw new Error('ERROR: Huffman table error(1)!');
          }
          (s = 0), (o += 1);
        }
      }
    }
  }
};
var d = class a {
  precision = [];
  tq = [0, 0, 0, 0];
  quantTables = c(4, 64);
  static enhanceQuantizationTable = function (t, e) {
    for (let r = 0; r < 8; r += 1) {
      (t[e[0 * 8 + r]] *= 90),
        (t[e[4 * 8 + r]] *= 90),
        (t[e[2 * 8 + r]] *= 118),
        (t[e[6 * 8 + r]] *= 49),
        (t[e[5 * 8 + r]] *= 71),
        (t[e[1 * 8 + r]] *= 126),
        (t[e[7 * 8 + r]] *= 25),
        (t[e[3 * 8 + r]] *= 106);
    }
    for (let r = 0; r < 8; r += 1) {
      (t[e[0 + 8 * r]] *= 90),
        (t[e[4 + 8 * r]] *= 90),
        (t[e[2 + 8 * r]] *= 118),
        (t[e[6 + 8 * r]] *= 49),
        (t[e[5 + 8 * r]] *= 71),
        (t[e[1 + 8 * r]] *= 126),
        (t[e[7 + 8 * r]] *= 25),
        (t[e[3 + 8 * r]] *= 106);
    }
    for (let r = 0; r < 64; r += 1) {
      t[r] >>= 6;
    }
  };
  read(t, e) {
    let r = 0,
      o,
      s,
      i,
      n = t.get16();
    for (r += 2; r < n; ) {
      if (((o = t.get8()), (r += 1), (s = o & 15), s > 3)) {
        throw new Error('ERROR: Quantization table ID > 3');
      }
      if (((this.precision[s] = o >> 4), this.precision[s] === 0)) {
        this.precision[s] = 8;
      } else if (this.precision[s] === 1) {
        this.precision[s] = 16;
      } else {
        throw new Error('ERROR: Quantization table precision error');
      }
      if (((this.tq[s] = 1), this.precision[s] === 8)) {
        for (i = 0; i < 64; i += 1) {
          if (r > n) {
            throw new Error('ERROR: Quantization table format error');
          }
          (this.quantTables[s][i] = t.get8()), (r += 1);
        }
        a.enhanceQuantizationTable(this.quantTables[s], e);
      } else {
        for (i = 0; i < 64; i += 1) {
          if (r > n) {
            throw new Error('ERROR: Quantization table format error');
          }
          (this.quantTables[s][i] = t.get16()), (r += 2);
        }
        a.enhanceQuantizationTable(this.quantTables[s], e);
      }
    }
    if (r !== n) {
      throw new Error('ERROR: Quantization table error [count!=Lq]');
    }
    return 1;
  }
};
var R = { acTabSel: 0, dcTabSel: 0, scanCompSel: 0 };
var g = class {
  ah = 0;
  al = 0;
  numComp = 0;
  selection = 0;
  spectralEnd = 0;
  components = [];
  read(t) {
    let e = 0,
      r,
      o,
      s = t.get16();
    for (
      e += 2, this.numComp = t.get8(), e += 1, r = 0;
      r < this.numComp;
      r += 1
    ) {
      if (((this.components[r] = { ...R }), e > s)) {
        throw new Error('ERROR: scan header format error');
      }
      (this.components[r].scanCompSel = t.get8()),
        (e += 1),
        (o = t.get8()),
        (e += 1),
        (this.components[r].dcTabSel = o >> 4),
        (this.components[r].acTabSel = o & 15);
    }
    if (
      ((this.selection = t.get8()),
      (e += 1),
      (this.spectralEnd = t.get8()),
      (e += 1),
      (o = t.get8()),
      (this.ah = o >> 4),
      (this.al = o & 15),
      (e += 1),
      e !== s)
    ) {
      throw new Error('ERROR: scan header format error [count!=Ns]');
    }
    return 1;
  }
};
var D = (function () {
    let a = new ArrayBuffer(2);
    return new DataView(a).setInt16(0, 256, !0), new Int16Array(a)[0] === 256;
  })(),
  E = class a {
    static IDCT_P = [
      0, 5, 40, 16, 45, 2, 7, 42, 21, 56, 8, 61, 18, 47, 1, 4, 41, 23, 58, 13,
      32, 24, 37, 10, 63, 17, 44, 3, 6, 43, 20, 57, 15, 34, 29, 48, 53, 26, 39,
      9, 60, 19, 46, 22, 59, 12, 33, 31, 50, 55, 25, 36, 11, 62, 14, 35, 28, 49,
      52, 27, 38, 30, 51, 54,
    ];
    static TABLE = [
      0, 1, 5, 6, 14, 15, 27, 28, 2, 4, 7, 13, 16, 26, 29, 42, 3, 8, 12, 17, 25,
      30, 41, 43, 9, 11, 18, 24, 31, 40, 44, 53, 10, 19, 23, 32, 39, 45, 52, 54,
      20, 22, 33, 38, 46, 51, 55, 60, 21, 34, 37, 47, 50, 56, 59, 61, 35, 36,
      48, 49, 57, 58, 62, 63,
    ];
    static MAX_HUFFMAN_SUBTREE = 50;
    static MSB = 2147483648;
    static RESTART_MARKER_BEGIN = 65488;
    static RESTART_MARKER_END = 65495;
    buffer = null;
    stream = null;
    frame = new x();
    huffTable = new p();
    quantTable = new d();
    scan = new g();
    DU = c(10, 4, 64);
    HuffTab = c(4, 2, 50 * 256);
    IDCT_Source = [];
    nBlock = [];
    acTab = c(10, 1);
    dcTab = c(10, 1);
    qTab = c(10, 1);
    marker = 0;
    markerIndex = 0;
    numComp = 0;
    restartInterval = 0;
    selection = 0;
    xDim = 0;
    yDim = 0;
    xLoc = 0;
    yLoc = 0;
    outputData = null;
    restarting = !1;
    mask = 0;
    numBytes = 0;
    precision = void 0;
    components = [];
    getter = null;
    setter = null;
    output = null;
    selector = null;
    constructor(t, e) {
      (this.buffer = t ?? null), (this.numBytes = e ?? 0);
    }
    decompress(t, e, r) {
      return this.decode(t, e, r).buffer;
    }
    decode(t, e, r, o) {
      let s = 0,
        i = [],
        n,
        f,
        u = [],
        l = [],
        m;
      t && (this.buffer = t),
        o !== void 0 && (this.numBytes = o),
        (this.stream = new b(this.buffer, e, r)),
        (this.buffer = null),
        (this.xLoc = 0),
        (this.yLoc = 0);
      let h = this.stream.get16();
      if (h !== 65496) {
        throw new Error('Not a JPEG file');
      }
      for (h = this.stream.get16(); h >> 4 !== 4092 || h === 65476; ) {
        switch (h) {
          case 65476:
            this.huffTable.read(this.stream, this.HuffTab);
            break;
          case 65484:
            throw new Error(
              "Program doesn't support arithmetic coding. (format throw new IOException)"
            );
          case 65499:
            this.quantTable.read(this.stream, a.TABLE);
            break;
          case 65501:
            this.restartInterval = this.readNumber() ?? 0;
            break;
          case 65504:
          case 65505:
          case 65506:
          case 65507:
          case 65508:
          case 65509:
          case 65510:
          case 65511:
          case 65512:
          case 65513:
          case 65514:
          case 65515:
          case 65516:
          case 65517:
          case 65518:
          case 65519:
            this.readApp();
            break;
          case 65534:
            this.readComment();
            break;
          default:
            if (h >> 8 !== 255) {
              throw new Error('ERROR: format throw new IOException! (decode)');
            }
        }
        h = this.stream.get16();
      }
      if (h < 65472 || h > 65479) {
        throw new Error('ERROR: could not handle arithmetic code!');
      }
      this.frame.read(this.stream), (h = this.stream.get16());
      do {
        for (; h !== 65498; ) {
          switch (h) {
            case 65476:
              this.huffTable.read(this.stream, this.HuffTab);
              break;
            case 65484:
              throw new Error(
                "Program doesn't support arithmetic coding. (format throw new IOException)"
              );
            case 65499:
              this.quantTable.read(this.stream, a.TABLE);
              break;
            case 65501:
              this.restartInterval = this.readNumber() ?? 0;
              break;
            case 65504:
            case 65505:
            case 65506:
            case 65507:
            case 65508:
            case 65509:
            case 65510:
            case 65511:
            case 65512:
            case 65513:
            case 65514:
            case 65515:
            case 65516:
            case 65517:
            case 65518:
            case 65519:
              this.readApp();
              break;
            case 65534:
              this.readComment();
              break;
            default:
              if (h >> 8 !== 255) {
                throw new Error(
                  'ERROR: format throw new IOException! (Parser.decode)'
                );
              }
          }
          h = this.stream.get16();
        }
        switch (
          ((this.precision = this.frame.precision),
          (this.components = this.frame.components),
          this.numBytes ||
            (this.numBytes = Math.round(Math.ceil(this.precision / 8))),
          this.numBytes === 1 ? (this.mask = 255) : (this.mask = 65535),
          this.scan.read(this.stream),
          (this.numComp = this.scan.numComp),
          (this.selection = this.scan.selection),
          this.numBytes === 1
            ? this.numComp === 3
              ? ((this.getter = this.getValueRGB),
                (this.setter = this.setValueRGB),
                (this.output = this.outputRGB))
              : ((this.getter = this.getValue8),
                (this.setter = this.setValue8),
                (this.output = this.outputSingle))
            : ((this.getter = this.getValue8),
              (this.setter = this.setValue8),
              (this.output = this.outputSingle)),
          this.selection)
        ) {
          case 2:
            this.selector = this.select2;
            break;
          case 3:
            this.selector = this.select3;
            break;
          case 4:
            this.selector = this.select4;
            break;
          case 5:
            this.selector = this.select5;
            break;
          case 6:
            this.selector = this.select6;
            break;
          case 7:
            this.selector = this.select7;
            break;
          default:
            this.selector = this.select1;
            break;
        }
        for (n = 0; n < this.numComp; n += 1) {
          (f = this.scan.components[n].scanCompSel),
            (this.qTab[n] =
              this.quantTable.quantTables[this.components[f].quantTableSel]),
            (this.nBlock[n] =
              this.components[f].vSamp * this.components[f].hSamp),
            (this.dcTab[n] = this.HuffTab[this.scan.components[n].dcTabSel][0]),
            (this.acTab[n] = this.HuffTab[this.scan.components[n].acTabSel][1]);
        }
        for (
          this.xDim = this.frame.dimX,
            this.yDim = this.frame.dimY,
            this.numBytes === 1
              ? (this.outputData = new Uint8Array(
                  new ArrayBuffer(
                    this.xDim * this.yDim * this.numBytes * this.numComp
                  )
                ))
              : (this.outputData = new Uint16Array(
                  new ArrayBuffer(
                    this.xDim * this.yDim * this.numBytes * this.numComp
                  )
                )),
            s += 1;
          ;

        ) {
          for (u[0] = 0, l[0] = 0, n = 0; n < 10; n += 1) {
            i[n] = 1 << (this.precision - 1);
          }
          if (this.restartInterval === 0) {
            for (
              h = this.decodeUnit(i, u, l);
              h === 0 && this.xLoc < this.xDim && this.yLoc < this.yDim;

            ) {
              this.output(i), (h = this.decodeUnit(i, u, l));
            }
            break;
          }
          for (
            m = 0;
            m < this.restartInterval &&
            ((this.restarting = m === 0),
            (h = this.decodeUnit(i, u, l)),
            this.output(i),
            h === 0);
            m += 1
          ) {
            let foo = 1;
          }
          if (
            (h === 0 &&
              (this.markerIndex !== 0
                ? ((h = 65280 | this.marker), (this.markerIndex = 0))
                : (h = this.stream.get16())),
            !(h >= a.RESTART_MARKER_BEGIN && h <= a.RESTART_MARKER_END))
          ) {
            break;
          }
        }
        h === 65500 &&
          s === 1 &&
          (this.readNumber(), (h = this.stream.get16()));
      } while (
        h !== 65497 &&
        this.xLoc < this.xDim &&
        this.yLoc < this.yDim &&
        s === 0
      );
      return this.outputData;
    }
    decodeUnit(t, e, r) {
      return this.numComp === 1
        ? this.decodeSingle(t, e, r)
        : this.numComp === 3
        ? this.decodeRGB(t, e, r)
        : -1;
    }
    select1(t) {
      return this.getPreviousX(t);
    }
    select2(t) {
      return this.getPreviousY(t);
    }
    select3(t) {
      return this.getPreviousXY(t);
    }
    select4(t) {
      return (
        this.getPreviousX(t) + this.getPreviousY(t) - this.getPreviousXY(t)
      );
    }
    select5(t) {
      return (
        this.getPreviousX(t) +
        ((this.getPreviousY(t) - this.getPreviousXY(t)) >> 1)
      );
    }
    select6(t) {
      return (
        this.getPreviousY(t) +
        ((this.getPreviousX(t) - this.getPreviousXY(t)) >> 1)
      );
    }
    select7(t) {
      return (this.getPreviousX(t) + this.getPreviousY(t)) / 2;
    }
    decodeRGB(t, e, r) {
      if (this.selector === null) {
        throw new Error("decode hasn't run yet");
      }
      let o, s, i, n, f, u, l;
      for (
        t[0] = this.selector(0),
          t[1] = this.selector(1),
          t[2] = this.selector(2),
          n = 0;
        n < this.numComp;
        n += 1
      ) {
        for (
          i = this.qTab[n], o = this.acTab[n], s = this.dcTab[n], f = 0;
          f < this.nBlock[n];
          f += 1
        ) {
          for (u = 0; u < this.IDCT_Source.length; u += 1) {
            this.IDCT_Source[u] = 0;
          }
          let m = this.getHuffmanValue(s, e, r);
          if (m >= 65280) {
            return m;
          }
          for (
            t[n] = this.IDCT_Source[0] = t[n] + this.getn(r, m, e, r),
              this.IDCT_Source[0] *= i[0],
              l = 1;
            l < 64;
            l += 1
          ) {
            if (((m = this.getHuffmanValue(o, e, r)), m >= 65280)) {
              return m;
            }
            if (((l += m >> 4), m & 15)) {
              this.IDCT_Source[a.IDCT_P[l]] = this.getn(r, m & 15, e, r) * i[l];
            } else if (!(m >> 4)) {
              break;
            }
          }
        }
      }
      return 0;
    }
    decodeSingle(t, e, r) {
      if (this.selector === null) {
        throw new Error("decode hasn't run yet");
      }
      let o, s, i, n;
      for (
        this.restarting
          ? ((this.restarting = !1), (t[0] = 1 << (this.frame.precision - 1)))
          : (t[0] = this.selector()),
          s = 0;
        s < this.nBlock[0];
        s += 1
      ) {
        if (((o = this.getHuffmanValue(this.dcTab[0], e, r)), o >= 65280)) {
          return o;
        }
        if (
          ((i = this.getn(t, o, e, r)),
          (n = i >> 8),
          n >= a.RESTART_MARKER_BEGIN && n <= a.RESTART_MARKER_END)
        ) {
          return n;
        }
        t[0] += i;
      }
      return 0;
    }
    getHuffmanValue(t, e, r) {
      let o, s;
      if (!this.stream) {
        throw new Error('stream not initialized');
      }
      if (
        (r[0] < 8
          ? ((e[0] <<= 8),
            (s = this.stream.get8()),
            s === 255 &&
              ((this.marker = this.stream.get8()),
              this.marker !== 0 && (this.markerIndex = 9)),
            (e[0] |= s))
          : (r[0] -= 8),
        (o = t[e[0] >> r[0]]),
        o & a.MSB)
      ) {
        if (this.markerIndex !== 0) {
          return (this.markerIndex = 0), 65280 | this.marker;
        }
        (e[0] &= 65535 >> (16 - r[0])),
          (e[0] <<= 8),
          (s = this.stream.get8()),
          s === 255 &&
            ((this.marker = this.stream.get8()),
            this.marker !== 0 && (this.markerIndex = 9)),
          (e[0] |= s),
          (o = t[(o & 255) * 256 + (e[0] >> r[0])]),
          (r[0] += 8);
      }
      if (((r[0] += 8 - (o >> 8)), r[0] < 0)) {
        throw new Error(
          'index=' +
            r[0] +
            ' temp=' +
            e[0] +
            ' code=' +
            o +
            ' in HuffmanValue()'
        );
      }
      return r[0] < this.markerIndex
        ? ((this.markerIndex = 0), 65280 | this.marker)
        : ((e[0] &= 65535 >> (16 - r[0])), o & 255);
    }
    getn(t, e, r, o) {
      let s, i;
      if (this.stream === null) {
        throw new Error('stream not initialized');
      }
      if (e === 0) {
        return 0;
      }
      if (e === 16) {
        return t[0] >= 0 ? -32768 : 32768;
      }
      if (((o[0] -= e), o[0] >= 0)) {
        if (o[0] < this.markerIndex && !this.isLastPixel()) {
          return (this.markerIndex = 0), (65280 | this.marker) << 8;
        }
        (s = r[0] >> o[0]), (r[0] &= 65535 >> (16 - o[0]));
      } else {
        if (
          ((r[0] <<= 8),
          (i = this.stream.get8()),
          i === 255 &&
            ((this.marker = this.stream.get8()),
            this.marker !== 0 && (this.markerIndex = 9)),
          (r[0] |= i),
          (o[0] += 8),
          o[0] < 0)
        ) {
          if (this.markerIndex !== 0) {
            return (this.markerIndex = 0), (65280 | this.marker) << 8;
          }
          (r[0] <<= 8),
            (i = this.stream.get8()),
            i === 255 &&
              ((this.marker = this.stream.get8()),
              this.marker !== 0 && (this.markerIndex = 9)),
            (r[0] |= i),
            (o[0] += 8);
        }
        if (o[0] < 0) {
          throw new Error('index=' + o[0] + ' in getn()');
        }
        if (o[0] < this.markerIndex) {
          return (this.markerIndex = 0), (65280 | this.marker) << 8;
        }
        (s = r[0] >> o[0]), (r[0] &= 65535 >> (16 - o[0]));
      }
      return s < 1 << (e - 1) && (s += (-1 << e) + 1), s;
    }
    getPreviousX(t = 0) {
      if (this.getter === null) {
        throw new Error("decode hasn't run yet");
      }
      return this.xLoc > 0
        ? this.getter(this.yLoc * this.xDim + this.xLoc - 1, t)
        : this.yLoc > 0
        ? this.getPreviousY(t)
        : 1 << (this.frame.precision - 1);
    }
    getPreviousXY(t = 0) {
      if (this.getter === null) {
        throw new Error("decode hasn't run yet");
      }
      return this.xLoc > 0 && this.yLoc > 0
        ? this.getter((this.yLoc - 1) * this.xDim + this.xLoc - 1, t)
        : this.getPreviousY(t);
    }
    getPreviousY(t = 0) {
      if (this.getter === null) {
        throw new Error("decode hasn't run yet");
      }
      return this.yLoc > 0
        ? this.getter((this.yLoc - 1) * this.xDim + this.xLoc, t)
        : this.getPreviousX(t);
    }
    isLastPixel() {
      return this.xLoc === this.xDim - 1 && this.yLoc === this.yDim - 1;
    }
    outputSingle(t) {
      if (this.setter === null) {
        throw new Error("decode hasn't run yet");
      }
      this.xLoc < this.xDim &&
        this.yLoc < this.yDim &&
        (this.setter(this.yLoc * this.xDim + this.xLoc, this.mask & t[0]),
        (this.xLoc += 1),
        this.xLoc >= this.xDim && ((this.yLoc += 1), (this.xLoc = 0)));
    }
    outputRGB(t) {
      if (this.setter === null) {
        throw new Error("decode hasn't run yet");
      }
      let e = this.yLoc * this.xDim + this.xLoc;
      this.xLoc < this.xDim &&
        this.yLoc < this.yDim &&
        (this.setter(e, t[0], 0),
        this.setter(e, t[1], 1),
        this.setter(e, t[2], 2),
        (this.xLoc += 1),
        this.xLoc >= this.xDim && ((this.yLoc += 1), (this.xLoc = 0)));
    }
    setValue8(t, e) {
      if (!this.outputData) {
        throw new Error('output data not ready');
      }
      D
        ? (this.outputData[t] = e)
        : (this.outputData[t] = ((e & 255) << 8) | ((e >> 8) & 255));
    }
    getValue8(t) {
      if (this.outputData === null) {
        throw new Error('output data not ready');
      }
      if (D) {
        return this.outputData[t];
      }
      {
        let e = this.outputData[t];
        return ((e & 255) << 8) | ((e >> 8) & 255);
      }
    }
    setValueRGB(t, e, r = 0) {
      this.outputData !== null && (this.outputData[t * 3 + r] = e);
    }
    getValueRGB(t, e) {
      if (this.outputData === null) {
        throw new Error('output data not ready');
      }
      return this.outputData[t * 3 + e];
    }
    readApp() {
      if (this.stream === null) {
        return null;
      }
      let t = 0,
        e = this.stream.get16();
      for (t += 2; t < e; ) {
        this.stream.get8(), (t += 1);
      }
      return e;
    }
    readComment() {
      if (this.stream === null) {
        return null;
      }
      let t = '',
        e = 0,
        r = this.stream.get16();
      for (e += 2; e < r; ) {
        (t += this.stream.get8()), (e += 1);
      }
      return t;
    }
    readNumber() {
      if (this.stream === null) {
        return null;
      }
      if (this.stream.get16() !== 4) {
        throw new Error(
          'ERROR: Define number format throw new IOException [Ld!=4]'
        );
      }
      return this.stream.get16();
    }
  };
export {
  w as ComponentSpec,
  b as DataStream,
  E as Decoder,
  x as FrameHeader,
  p as HuffmanTable,
  d as QuantizationTable,
  R as ScanComponent,
  g as ScanHeader,
  k as Utils,
};
//# sourceMappingURL=lossless-min.js.map
