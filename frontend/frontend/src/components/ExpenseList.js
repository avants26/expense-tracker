const ExpenseList = ({ expenses, onDelete }) => {
    return (
        <div className="pro-card" style={{marginTop: '24px', flex: 1}}>
            <h3 className="card-title">Audit Log / Recent Transactions</h3>
            <div className="expense-list" style={{maxHeight: '400px', overflowY: 'auto'}}>
                {expenses.length === 0 ? (
                    <p style={{color: 'var(--text-muted)', textAlign: 'center', padding: '20px'}}>
                        No transactions recorded in the current ledger.
                    </p>
                ) : (
                    expenses.map((expense) => (
                        <div key={expense._id} className="expense-item-row">
                            <div className="expense-info">
                                <span className="expense-category-tag">{expense.category}</span>
                                <div className="expense-details">
                                    <span className="expense-title">{expense.title}</span>
                                    <span style={{fontSize: '0.8rem', color: 'var(--text-muted)'}}>
                                        {new Date(expense.date).toLocaleDateString()}
                                    </span>
                                </div>
                            </div>
                            <div className="expense-actions">
                                <span className="expense-amount">₹{expense.amount.toLocaleString()}</span>
                                <button 
                                    className="btn-icon" 
                                    style={{color: 'var(--danger)'}}
                                    onClick={() => onDelete(expense._id)}
                                >
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default ExpenseList;
