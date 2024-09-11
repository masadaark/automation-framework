
class Obj {
    static IsBlank(val: any): boolean {
        if (this.IsObj(val)) return Object.keys(val).length === 0;
        return false;
    }
    static IsObj(val: any): boolean {
        return typeof val === "object" && val !== null;
    }
    static ToString(val: any): string {
        try {
            return String(JSON.stringify(val));
        } catch (error) {
            return String(val);
        }
    }
}
export default Obj