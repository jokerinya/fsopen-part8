import React, { useState } from 'react';
import { useQuery } from '@apollo/client';
import { ALL_BOOKS_WITHOUT_PARAMS } from '../queries';

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
            <table>
                <tbody>
                    <tr>
                        <th></th>
                        <th>author</th>
                        <th>published</th>
                    </tr>
                    {filteredBooks.map((a) => (
                        <tr key={a.id}>
                            <td>{a.title}</td>
                            <td>{a.author.name}</td>
                            <td>{a.published}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
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
