import Obj from "../util/object.util";

class Validator {
    static Var(val: any): boolean {
        return val !== undefined && val !== null && val !== '' && !Obj.IsBlank(val);
    }
}

export default Validator