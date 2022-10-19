import React, { useState } from 'react';
import { useQuery } from '@apollo/client';
import { ALL_BOOKS_WITHOUT_PARAMS } from '../queries';
import BooksTable from './BooksTable';

const Books = (props) => {
    const result = useQuery(ALL_BOOKS_WITHOUT_PARAMS);

    const [genreFilter, setGenreFilter] = useState(null);

    if (!props.show) {
        return null;
    }

    if (result.loading) {
        return <div>loading...</div>;
    }

    const books = result.data.allBooks;

    const genresArr = [];
    for (const book of books) {
        const genresOfBook = book.genres;
        genresOfBook.forEach((genre) => {
            genresArr.push(genre);
        });
    }
    const totalGenres = [...new Set(genresArr)];

    const filteredBooks = genreFilter
        ? books.filter((book) => book.genres.includes(genreFilter))
        : books;

    return (
        <div>
            <h2>books</h2>
            <BooksTable books={filteredBooks} />
            <div>
                {totalGenres.map((genre) => (
                    <button key={genre} onClick={() => setGenreFilter(genre)}>
                        {genre}
                    </button>
                ))}
                <button onClick={() => setGenreFilter(null)}>all genres</button>
            </div>
        </div>
    );
};

export default Books;
