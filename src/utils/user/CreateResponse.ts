import { Response } from "express"

type StatusCode = 200 | 500 | 400
interface statusCodeProps {
    data: any,
    statusCode: StatusCode,
    res: Response
}
export const CreateResponse = ({ data, res, statusCode }: statusCodeProps) => {
    return res.status(statusCode).json(data)
}