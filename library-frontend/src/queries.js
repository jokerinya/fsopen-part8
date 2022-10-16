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
            author {
                name
            }
            published
            id
        }
    }
`;

export const ADD_BOOK = gql`
    mutation createBook(
        $title: String!
        $author: String!
        $published: Int!
        $genres: [String!]!
    ) {
        addBook(
            title: $title
            author: $author
            published: $published
            genres: $genres
        ) {
            title
            author
            published
            id
        }
    }
`;

export const EDIT_AUTHOR_BORN = gql`
    mutation setBirthYear($name: String!, $setBornTo: Int!) {
        editAuthor(name: $name, setBornTo: $setBornTo) {
            name
            born
            bookCount
            id
        }
    }
`;
