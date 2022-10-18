import React, { useEffect } from 'react';
import { useMutation } from '@apollo/client';
import { useField } from '../hooks';
import { LOGIN } from '../queries';

const LoginForm = (props) => {
    const username = useField('text');
    const password = useField('password');
    const [login, result] = useMutation(LOGIN);

    useEffect(() => {
        if (result.data) {
            const token = result.data.login.value;
            props.setToken(token);
            localStorage.setItem('library-user-token', token);
            props.setPage('authors');
        }
    }, [result.data]); // eslint-disable-line

    if (!props.show) {
        return null;
    }

    const handleSubmit = (event) => {
        event.preventDefault();
        login({
            variables: { username: username.value, password: password.value },
        });
        username.clear();
        password.clear();
    };

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <div>
                    username:{' '}
                    <input
                        value={username.value}
                        onChange={username.onChange}
                        type={username.type}
                    />
                </div>
                <div>
                    password:{' '}
                    <input
                        value={password.value}
                        onChange={password.onChange}
                        type={password.type}
                    />
                </div>
                <button>login</button>
            </form>
        </div>
    );
};

export default LoginForm;
