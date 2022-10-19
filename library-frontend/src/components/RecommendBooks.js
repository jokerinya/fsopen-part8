import React from 'react';
import { useQuery } from '@apollo/client';
import { USER_INFO, ALL_BOOKS_WITH_GENRE } from '../queries';

import BooksTable from './BooksTable';

const RecommendBooks = ({ show, token }) => {
    const user = useQuery(USER_INFO, {
        skip: !token,
    });

    const books = useQuery(ALL_BOOKS_WITH_GENRE, {
        variables: { genre: user?.data?.me?.favouriteGenre },
        skip: !token || !user?.data?.me?.favouriteGenre,
    });

    if (!show || !token) {
        return null;
    }

    if (books.loading) {
        return <p>loading...</p>;
    }

    return (
        <div>
            <h2>recommendations</h2>
            <p>
                books in your favourite genre{' '}
                <b>{user.data.me.favouriteGenre}</b>
            </p>
            <BooksTable books={books.data.allBooks} />
        </div>
    );
};

export default RecommendBooks;
