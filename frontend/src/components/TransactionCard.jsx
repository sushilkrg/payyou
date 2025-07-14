
const TransactionCard = ({ transaction }) => {
  // console.log(transaction);

  return (
    <div className='flex justify-between items-center mt-2 bg-white w-full py-4 px-6 shadow rounded-lg'>
      <div className='flex items-center gap-2'>
        <div>{transaction.type === "add"
          ? "➕"
          : transaction.type === "send"
            ? "↗️"
            : transaction.type === "receive"
              ? "↙️"
              : ""}
        </div>
        <div className='flex flex-col lg:items-center lg:flex-row lg:gap-2'>
          <p className='text-sm text-gray-600'>
            {transaction.type === "add"
              ? "added to"
              : transaction.type === "send"
                ? "sent to"
                : transaction.type === "receive"
                  ? "received from"
                  : ""}
          </p>
          <p> {transaction.type === "add"
            ? `${transaction.toName}`
            : transaction.type === "send"
              ? `${transaction.toName}`
              : transaction.type === "receive"
                ? `${transaction.fromName}`
                : ""}
          </p>
        </div>
      </div>
      <div className='flex items-center'>₹<span className='font-bold text-xl px-1'>{transaction?.amount}</span></div>
    </div>
  )
}

export default TransactionCard