interface BankStatement {
    transactionId: number,
    date: Date,
    categoryName: string,
    in: number,
    out: number,
    description: string,
    paidBy: string,
    month: string
 }
 
 export default BankStatement