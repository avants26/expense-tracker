import { useState } from 'react';

const ExpenseForm = ({ onAdd }) => {
    const [formData, setFormData] = useState({
        title: '',
        amount: '',
        category: 'Utilities',
        date: new Date().toISOString().split('T')[0]
    });

    const categories = ['Utilities', 'Rent/Mortgage', 'Payroll', 'Marketing', 'Operating Costs', 'Travel', 'Software/SaaS', 'Other'];

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!formData.title || !formData.amount) return;
        onAdd(formData);
        setFormData({ title: '', amount: '', category: 'Utilities', date: new Date().toISOString().split('T')[0] });
    };

    return (
        <div className="pro-card">
            <h3 className="card-title">Record New Outflow</h3>
            <form className="expense-form" onSubmit={handleSubmit}>
                <div className="input-glow-group">
                    <input 
                        type="text" 
                        placeholder="Transaction Description" 
                        value={formData.title}
                        onChange={(e) => setFormData({...formData, title: e.target.value})}
                        required
                    />
                </div>
                <div className="form-row" style={{display: 'flex', gap: '15px'}}>
                    <div className="input-glow-group" style={{flex: 1}}>
                        <input 
                            type="number" 
                            placeholder="Amount (INR)" 
                            value={formData.amount}
                            onChange={(e) => setFormData({...formData, amount: e.target.value})}
                            required
                        />
                    </div>
                    <select 
                        style={{flex: 1, background: '#1a1e28', border: '1px solid var(--border-subtle)', color: 'white', padding: '12px', borderRadius: '12px'}}
                        value={formData.category}
                        onChange={(e) => setFormData({...formData, category: e.target.value})}
                    >
                        {categories.map(cat => (
                            <option key={cat} value={cat}>{cat}</option>
                        ))}
                    </select>
                </div>
                <div className="input-glow-group">
                    <input 
                        type="date" 
                        value={formData.date}
                        onChange={(e) => setFormData({...formData, date: e.target.value})}
                    />
                </div>
                <button type="submit" className="btn-fintech">Authorize Transaction</button>
            </form>
        </div>
    );
};

export default ExpenseForm;
