interface PurchaseGoods {
    accountingId: number,
    amount: number,
    date: Date,
    userId: number,
    divide: boolean,
    categoryId: number,
    description: string
}

export default PurchaseGoods