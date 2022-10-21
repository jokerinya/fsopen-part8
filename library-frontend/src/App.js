import { useState } from 'react';

import { useApolloClient, useSubscription } from '@apollo/client';

import Authors from './components/Authors';
import Books from './components/Books';
import LoginForm from './components/LoginForm';
import NewBook from './components/NewBook';
import RecommendBooks from './components/RecommendBooks';
import { BOOK_ADDED } from './queries';

const App = () => {
    const [page, setPage] = useState('authors');
    const [token, setToken] = useState(
        localStorage.getItem('library-user-token') || null
    );
    useSubscription(BOOK_ADDED, {
        onSubscriptionData: ({ subscriptionData }) => {
            const book = subscriptionData.data.bookAdded;
            window.alert(`${book.author.name}'s ${book.title} has been added`);
        },
    });

    const client = useApolloClient();

    const logout = () => {
        setToken(null);
        localStorage.removeItem('library-user-token');
        client.resetStore(); // clears the apollo cache
        setPage('authors');
    };

    return (
        <div>
            <div>
                <button onClick={() => setPage('authors')}>authors</button>
                <button onClick={() => setPage('books')}>books</button>
                {token ? (
                    <>
                        <button onClick={() => setPage('add')}>add book</button>
                        <button onClick={() => setPage('recommend')}>
                            recommend
                        </button>
                        <button onClick={logout}>logout</button>
                    </>
                ) : (
                    <button onClick={() => setPage('login')}>login</button>
                )}
            </div>

            <Authors show={page === 'authors'} token={!!token} />

            <Books show={page === 'books'} />

            <NewBook show={page === 'add'} />

            <LoginForm
                show={page === 'login'}
                setToken={setToken}
                setPage={setPage}
            />

            <RecommendBooks show={page === 'recommend'} token={!!token} />
        </div>
    );
};

export default App;
