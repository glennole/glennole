interface IRefund {
    id: number,
    amount: number,
    description: string,
    accountingId: number,
    state: number,
    payerId: number,
    receiverId: number,
    transactionId: number,
    payer: string,
    receiver: string
}

export default IRefund