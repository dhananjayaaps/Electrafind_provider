import React, { useState } from 'react'
import { Link } from 'react-router-dom';
import './Login.css'

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleLogin = (e) => {
        e.preventDefault();

        if (username === '' || password === '') {
            setError('Username and password are required');
            return;
        }

        if (username === 'admin' && password === 'admin123') {
            console.log('Login successful');
            setError('');
        } else {
            setError('Invalid username or password');
        }
    };

    return (
        <div className='admin-login-container'>
            {error && <p className='error-message'>{error}</p>}
            <form onSubmit={handleLogin}>
                <div className='input-group'>
                    <label htmlFor='username'>Username</label>
                    <input
                        type='text'
                        name='username'
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                </div>
                <div className='input-group'>
                    <label htmlFor='password'>Password</label>
                    <input
                        type='password'
                        name='password'
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <Link to="/admin-panel"><button type="submit" className="login-button">Login</button></Link>
            </form>
        </div>
    )
}

export default Login