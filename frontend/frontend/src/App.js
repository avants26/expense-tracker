import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import "./App.css";

// Components
import Auth from "./components/Auth";
import ExpenseForm from "./components/ExpenseForm";
import ExpenseList from "./components/ExpenseList";
import CategoryChart from "./components/CategoryChart";
import TrendChart from "./components/TrendChart";

axios.defaults.baseURL = "http://localhost:5000";

function App() {
    const [expenses, setExpenses] = useState([]);
    const [token, setToken] = useState(localStorage.getItem('token'));
    const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')));
    const [loading, setLoading] = useState(true);

    const fetchExpenses = useCallback(async () => {
        if (!token) return;
        try {
            const config = {
                headers: { Authorization: `Bearer ${token}` }
            };
            const res = await axios.get("/api/expenses", config);
            setExpenses(res.data.data || []);
            setLoading(false);
        } catch (err) {
            console.error("Error fetching expenses:", err);
            if (err.response?.status === 401) logout();
            setLoading(false);
        }
    }, [token]);

    useEffect(() => {
        if (token) {
            fetchExpenses();
        } else {
            setLoading(false);
        }
    }, [token, fetchExpenses]);

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setToken(null);
        setUser(null);
        setExpenses([]);
    };

    const addExpense = async (formData) => {
        try {
            const config = {
                headers: { Authorization: `Bearer ${token}` }
            };
            await axios.post("/api/expenses", formData, config);
            fetchExpenses();
        } catch (err) {
            console.error("Error adding expense:", err);
        }
    };

    const deleteExpense = async (id) => {
        try {
            const config = {
                headers: { Authorization: `Bearer ${token}` }
            };
            await axios.delete(`/api/expenses/${id}`, config);
            fetchExpenses();
        } catch (err) {
            console.error("Error deleting expense:", err);
        }
    };

    const total = expenses.reduce((sum, e) => sum + Number(e.amount), 0);
    
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const weeklyTotal = expenses
        .filter(e => new Date(e.date) >= sevenDaysAgo)
        .reduce((sum, e) => sum + Number(e.amount), 0);

    const now = new Date();
    const monthlyTotal = expenses
        .filter(e => {
            const d = new Date(e.date);
            return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
        })
        .reduce((sum, e) => sum + Number(e.amount), 0);

    if (!token) {
        return <Auth setAuth={setToken} />;
    }

    return (
        <div className="fintech-dashboard">
            <nav className="dashboard-nav">
                <div className="logo-pro">
                    <span style={{color: 'var(--accent-primary)'}}>FIN</span>TRACK
                </div>
                <div style={{display: 'flex', alignItems: 'center', gap: '20px'}}>
                    <span style={{color: 'var(--text-muted)'}}>Terminal: {user?.name}</span>
                    <button onClick={logout} className="btn-icon" style={{color: 'var(--danger)', fontSize: '0.9rem', fontWeight: '600'}}>
                        Disconnect
                    </button>
                </div>
            </nav>

            <main className="app-container">
                <div className="stat-grid">
                    <div className="pro-card">
                        <span className="label">Total Capital Outflow</span>
                        <span className="value">₹{total.toLocaleString()}</span>
                    </div>
                    <div className="pro-card">
                        <span className="label">Weekly Velocity</span>
                        <span className="value" style={{color: 'var(--accent-secondary)'}}>₹{weeklyTotal.toLocaleString()}</span>
                    </div>
                    <div className="pro-card">
                        <span className="label">Monthly Projection</span>
                        <span className="value" style={{color: 'var(--accent-growth)'}}>₹{monthlyTotal.toLocaleString()}</span>
                    </div>
                </div>

                <div className="main-layout">
                    <div className="dashboard-left">
                        <TrendChart expenses={expenses} />
                        <ExpenseList expenses={expenses} onDelete={deleteExpense} />
                    </div>

                    <div className="dashboard-right">
                        <ExpenseForm onAdd={addExpense} />
                        <CategoryChart expenses={expenses} />
                    </div>
                </div>
            </main>
        </div>
    );
}

export default App;