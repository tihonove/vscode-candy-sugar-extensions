export class LineColumnOffsetConverter {
    private readonly str: string;
    private readonly lineToIndex: number[];
    private readonly origin: number;

    public constructor(str: string, options: { origin?: number } = {}) {
        this.str = str || "";
        this.lineToIndex = this.buildLineToIndex(this.str);
        this.origin = options.origin == undefined ? 1 : options.origin;
    }

    public fromOffset(index: number): { line: number; column: number } {
        if (index < 0 || index >= this.str.length || isNaN(index)) {
            return { column: this.origin, line: this.origin };
        }

        const line = this.findLowerIndexInRangeArray(index, this.lineToIndex);
        return {
            line: line + this.origin,
            column: index - this.lineToIndex[line] + this.origin,
        };
    }

    public toIndex(line: number, column: number): number {
        if (isNaN(line) || isNaN(column)) {
            return -1;
        }

        const normalizedLine = line - this.origin;
        const normalizedColumn = column - this.origin;

        if (normalizedLine >= 0 && normalizedColumn >= 0 && normalizedLine < this.lineToIndex.length) {
            const lineIndex = this.lineToIndex[normalizedLine];
            const nextIndex =
                normalizedLine === this.lineToIndex.length - 1 ? this.str.length : this.lineToIndex[normalizedLine + 1];

            if (normalizedColumn < nextIndex - lineIndex) {
                return lineIndex + normalizedColumn;
            }
        }
        return -1;
    }

    private buildLineToIndex(str: string): number[] {
        const lines = str.split("\n");
        const lineToIndex = new Array(lines.length);
        let index = 0;

        const l = lines.length;
        for (let i = 0; i < l; i++) {
            lineToIndex[i] = index;
            index += lines[i].length + /* "\n".length */ 1;
        }
        return lineToIndex;
    }

    private findLowerIndexInRangeArray(value: number, arr: number[]): number {
        if (value >= arr[arr.length - 1]) {
            return arr.length - 1;
        }

        let min = 0;
        let max = arr.length - 2;
        let mid;
        while (min < max) {
            // tslint:disable-next-line:no-bitwise
            mid = min + ((max - min) >> 1);

            if (value < arr[mid]) {
                max = mid - 1;
            } else if (value >= arr[mid + 1]) {
                min = mid + 1;
            } else {
                min = mid;
                break;
            }
        }
        return min;
    }
}
