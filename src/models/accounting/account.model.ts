import type { GlobalsString } from "csstype"

interface IAccount {
    id: number,
    userId: number,
    accountingId: number,
    type: number,
    name: string,
    description: string
}

export default IAccount