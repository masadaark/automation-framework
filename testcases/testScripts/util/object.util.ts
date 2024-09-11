
class Obj {
    static IsBlank(val: any): boolean {
        if (this.IsObj(val)) return Object.keys(val).length === 0;
        return false;
    }
    static IsObj(val: any): boolean {
        return typeof val === "object" && val !== null;
    }
}
export default Obj