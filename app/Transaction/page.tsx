import React from 'react';

const TransactionPage = () => {
  return (
    <div className="min-h-screen bg-white text-black font-mono p-8 border-4 border-black">
      {/* Header Section */}
      <div className="flex justify-between items-end border-b-4 border-black pb-4 mb-8">
        <div>
          <h1 className="text-6xl font-black uppercase leading-none">Transactions.</h1>
          <p className="mt-2 text-sm">// FINANCIAL_LEDGER_V1.0 // STATUS: ENCRYPTED</p>
        </div>
        <div className="text-right">
          <p className="text-xs uppercase">Current Balance</p>
          <p className="text-4xl font-bold">₹1,240.00</p>
        </div>
      </div>

      {/* Grid Layout for History */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-0 border-2 border-black">
        {/* Table Headers */}
        <div className="md:col-span-2 p-4 bg-black text-white uppercase font-bold text-xs border-r border-white">Date</div>
        <div className="md:col-span-5 p-4 bg-black text-white uppercase font-bold text-xs border-r border-white">Description / ID</div>
        <div className="md:col-span-2 p-4 bg-black text-white uppercase font-bold text-xs border-r border-white">Type</div>
        <div className="md:col-span-3 p-4 bg-black text-white uppercase font-bold text-xs">Amount</div>

        {/* Transaction Rows (Mapping your Django Data) */}
        {[
          { id: "TXN-882", type: "CREDIT", amount: "+500.00", desc: "Task: Math Tutoring (Assigned)", date: "06-01-2026" },
          { id: "TXN-881", type: "DEBIT", amount: "-60.00", desc: "System Commission Fee (12%)", date: "05-01-2026" },
          { id: "TXN-879", type: "WITHDRAWAL", amount: "-200.00", desc: "Bank Transfer to UPI", date: "04-01-2026" },
        ].map((txn, index) => (
          <React.Fragment key={index}>
            <div className="md:col-span-2 p-4 border-t border-r border-black text-sm">{txn.date}</div>
            <div className="md:col-span-5 p-4 border-t border-r border-black font-bold">
              {txn.desc} <span className="block text-[10px] font-normal opacity-50">#{txn.id}</span>
            </div>
            <div className={`md:col-span-2 p-4 border-t border-r border-black text-xs font-bold uppercase ${txn.type === 'CREDIT' ? 'text-green-600' : 'text-red-600'}`}>
              [{txn.type}]
            </div>
            <div className="md:col-span-3 p-4 border-t border-black text-xl font-black text-right">
              {txn.amount}
            </div>
          </React.Fragment>
        ))}
      </div>

      {/* Footer Info */}
      <div className="mt-12 flex justify-between border-t-2 border-black pt-4 italic text-xs uppercase opacity-60">
        <span>PocketFix Decentralized Ledger System</span>
        <span>Indore, India // 22.7° N</span>
      </div>
    </div>
  );
};

export default TransactionPage;