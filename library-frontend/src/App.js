import { useState } from 'react';

import { useApolloClient } from '@apollo/client';

import Authors from './components/Authors';
import Books from './components/Books';
import LoginForm from './components/LoginForm';
import NewBook from './components/NewBook';

const App = () => {
    const [page, setPage] = useState('authors');
    const [token, setToken] = useState(
        localStorage.getItem('library-user-token') || null
    );

    const client = useApolloClient();

    const logout = () => {
        setToken(null);
        localStorage.removeItem('library-user-token');
        client.resetStore(); // clears the apollo cache
    };

    return (
        <div>
            <div>
                <button onClick={() => setPage('authors')}>authors</button>
                <button onClick={() => setPage('books')}>books</button>
                {token ? (
                    <>
                        <button onClick={() => setPage('add')}>add book</button>
                        <button onClick={logout}>logout</button>
                    </>
                ) : (
                    <button onClick={() => setPage('login')}>login</button>
                )}
            </div>

            <Authors show={page === 'authors'} user={!!token} />

            <Books show={page === 'books'} />

            <NewBook show={page === 'add'} />

            <LoginForm
                show={page === 'login'}
                setToken={setToken}
                setPage={setPage}
            />
        </div>
    );
};

export default App;
