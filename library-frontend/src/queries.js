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

export const ALL_BOOKS_WITHOUT_PARAMS = gql`
    query {
        allBooks {
            title
            author {
                name
            }
            published
            genres
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
            author {
                name
            }
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

export const LOGIN = gql`
    mutation login($username: String!, $password: String!) {
        login(username: $username, password: $password) {
            value
        }
    }
`;

export const USER_INFO = gql`
    query {
        me {
            username
            favouriteGenre
        }
    }
`;

export const ALL_BOOKS_WITH_GENRE = gql`
    query ($genre: String) {
        allBooks(genre: $genre) {
            title
            author {
                name
            }
            published
            id
        }
    }
`;

export const BOOK_ADDED = gql`
    subscription {
        bookAdded {
            title
            author {
                name
            }
            published
            id
        }
    }
`;
