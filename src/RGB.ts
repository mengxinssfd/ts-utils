function getLimitValue(value: number) {
    return Math.max(0, Math.min(value, 255));
}

export class RGB {
    public _r!: number;
    public _g!: number;
    public _b!: number;

    get r(): number {
        return this._r;
    }

    set r(value: number) {
        this._r = getLimitValue(value);
    }

    get g(): number {
        return this._g;
    }

    set g(value: number) {
        this._g = getLimitValue(value);
    }

    get b(): number {
        return this._b;
    }

    set b(value: number) {
        this._b = getLimitValue(value);
    }

    static validate(color: string) {
        const reg = /^[rR][gG][Bb][Aa]?[\(]([\s]*(2[0-4][0-9]|25[0-5]|[01]?[0-9][0-9]?),){2}[\s]*(2[0-4][0-9]|25[0-5]|[01]?[0-9][0-9]?),?[\s]*(0\.\d{1,2}|1|0)?[\)]{1}$/g;
        return reg.test(color);
    }

    constructor(r = 0, g = 0, b = 0) {
        this.r = r;
        this.g = g;
        this.b = b;
    }

    toString() {
        const {_r, _g, _b} = this;
        return `rgb(${_r},${{_g}},${{_b}})`;
    }
}

export class RGBA extends RGB {
    get a(): number {
        return this._a;
    }

    set a(value: number) {
        this._a = Math.max(0, Math.min(value, 1));
    }

    private _a!: number;

    constructor(r = 0, g = 0, b = 0, a = 1) {
        super(r, g, b);
        this.a = a;
    }

    toString() {
        const {r, g, b, a} = this;
        return `rgba(${r},${{g}},${b},${a}})`;
    }
}