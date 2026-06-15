import { useState } from 'react';
import axios from 'axios';

const Auth = ({ setAuth }) => {
    const [isLogin, setIsLogin] = useState(true);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: ''
    });
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register';
            const res = await axios.post(endpoint, formData);
            
            localStorage.setItem('token', res.data.token);
            localStorage.setItem('user', JSON.stringify(res.data.user));
            
            setAuth(res.data.token);
        } catch (err) {
            setError(err.response?.data?.error || 'Authentication failed');
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-card">
                <div className="auth-header">
                    <h2>{isLogin ? 'Welcome Back' : 'Create Account'}</h2>
                    <p style={{color: '#8e94a5'}}>Your private financial cockpit</p>
                </div>

                {error && <div style={{color: '#ff4b5c', marginBottom: '15px', textAlign: 'center', fontSize: '0.9rem'}}>{error}</div>}

                <form className="auth-form" onSubmit={handleSubmit}>
                    {!isLogin && (
                        <div className="input-glow-group">
                            <input 
                                type="text" 
                                placeholder="Full Name" 
                                value={formData.name}
                                onChange={(e) => setFormData({...formData, name: e.target.value})}
                                required 
                            />
                        </div>
                    )}
                    <div className="input-glow-group">
                        <input 
                            type="email" 
                            placeholder="Email Address" 
                            value={formData.email}
                            onChange={(e) => setFormData({...formData, email: e.target.value})}
                            required 
                        />
                    </div>
                    <div className="input-glow-group">
                        <input 
                            type="password" 
                            placeholder="Password" 
                            value={formData.password}
                            onChange={(e) => setFormData({...formData, password: e.target.value})}
                            required 
                        />
                    </div>
                    <button type="submit" className="btn-fintech">
                        {isLogin ? 'Login to Terminal' : 'Initialize Account'}
                    </button>
                </form>

                <div className="auth-toggle">
                    {isLogin ? "New here? " : "Already have an account? "}
                    <span onClick={() => setIsLogin(!isLogin)}>
                        {isLogin ? "Register Port" : "Login instead"}
                    </span>
                </div>
            </div>
        </div>
    );
};

export default Auth;
