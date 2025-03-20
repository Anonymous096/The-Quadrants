import React from 'react';

const ExpenditureLog = ({ transactions }) => {
  // Check if transactions is an array and has data before mapping
  if (!Array.isArray(transactions)) {
    return <div>No transactions available</div>;  // You can display a message or an empty list if no transactions exist
  }

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold">Expenditure Log</h3>
      <ul>
        {transactions.map((transaction) => (
          <li key={transaction.id} className="flex justify-between p-2 bg-gray-800 rounded mb-2">
            <span>{transaction.date}</span>
            <span>{transaction.amount}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ExpenditureLog;
