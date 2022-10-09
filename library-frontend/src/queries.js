import { gql } from '@apollo/client';

export const ALL_AUTHORS = gql`
    query {
        allAuthors {
            name
            born
            bookCount
            id
        }
    }
`;

export const ALL_BOOKS_WITHOUT_GENRES = gql`
    query {
        allBooks {
            title
            author
            published
            id
        }
    }
`;
