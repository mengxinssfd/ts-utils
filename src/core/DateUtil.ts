import {formatDate, getTheLastDateOfAMonth} from "./time";

export class DateUtil {
    private date!: Date;

    static init(date: Date = new Date()) {
        return new DateUtil(date);
    }

    constructor(private originDate: Date = new Date()) {
        this.reset();
    }

    add(num: number, type: 'y' | 'M' | 'd' | 'h' | 'm' | 's' | 'ms') {
        const map: Record<typeof type, string> = {
            y: 'FullYear',
            M: 'Month',
            d: 'Date',
            h: 'Hours',
            m: 'Minutes',
            s: 'Seconds',
            ms: 'Milliseconds',
        };
        const name = map[type];
        // this.date.setMilliseconds(this.date.getFullYear()+num);
        this.date[`set${name}`](this.date[`get${name}`]() + num);
    }

    toMonthFirstDate() {
        this.date.setDate(1);
        return this;
    }

    toMonthLastDate() {
        this.date = getTheLastDateOfAMonth(this.date);
        return this;
    }

    toTheLastDateOfAMonth(month: number) {
        this.date.setMonth(month);
        this.date = getTheLastDateOfAMonth(this.date);
        return this;
    }

    toLastMonthLastDate() {
        this.date.setDate(-1);
        return this;
    }

    reset() {
        this.date = new Date(this.originDate);
    }

    /**
     * 格式化时间，代替formatDate.call，formatDate.call赋值总是有warn
     * @param [format="yyyy-MM-dd hh:mm:ss"]
     */
    toString(format = "yyyy-MM-dd hh:mm:ss") {
        return formatDate(this.date, format);
    }

    toDate() {
        return new Date(this.date);
    }
}