import { HttpResponse } from "../interface/file_interface/http_file.model";

const httpRes: HttpResponse = { body: {} }
// const rabbitMesssage:QueueMessag= { message : {} }
const ResClass = {
    MultiHttp: [httpRes],
    Http: httpRes,
    // rabbitMesssage:rabbitMesssage,
    Query: [],
}

export default ResClass;