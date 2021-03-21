declare global {
    interface Date {
        /**
         *
         * @param format {string} [format="yyyy-MM-dd hh:mm:ss"]
         */
        format(format?: string): string;
    }
}
export {};
