const { ApolloServer, gql } = require('apollo-server');
const { v1: uuid } = require('uuid');

let authors = [
    {
        name: 'Robert Martin',
        id: 'afa51ab0-344d-11e9-a414-719c6709cf3e',
        born: 1952,
    },
    {
        name: 'Martin Fowler',
        id: 'afa5b6f0-344d-11e9-a414-719c6709cf3e',
        born: 1963,
    },
    {
        name: 'Fyodor Dostoevsky',
        id: 'afa5b6f1-344d-11e9-a414-719c6709cf3e',
        born: 1821,
    },
    {
        name: 'Joshua Kerievsky', // birthyear not known
        id: 'afa5b6f2-344d-11e9-a414-719c6709cf3e',
    },
    {
        name: 'Sandi Metz', // birthyear not known
        id: 'afa5b6f3-344d-11e9-a414-719c6709cf3e',
    },
];

/*
 * Suomi:
 * Saattaisi olla järkevämpää assosioida kirja ja sen tekijä tallettamalla kirjan yhteyteen tekijän nimen sijaan tekijän id
 * Yksinkertaisuuden vuoksi tallennamme kuitenkin kirjan yhteyteen tekijän nimen
 *
 * English:
 * It might make more sense to associate a book with its author by storing the author's id in the context of the book instead of the author's name
 * However, for simplicity, we will store the author's name in connection with the book
 *
 * Spanish:
 * Podría tener más sentido asociar un libro con su autor almacenando la id del autor en el contexto del libro en lugar del nombre del autor
 * Sin embargo, por simplicidad, almacenaremos el nombre del autor en conección con el libro
 */

let books = [
    {
        title: 'Clean Code',
        published: 2008,
        author: 'Robert Martin',
        id: 'afa5b6f4-344d-11e9-a414-719c6709cf3e',
        genres: ['refactoring'],
    },
    {
        title: 'Agile software development',
        published: 2002,
        author: 'Robert Martin',
        id: 'afa5b6f5-344d-11e9-a414-719c6709cf3e',
        genres: ['agile', 'patterns', 'design'],
    },
    {
        title: 'Refactoring, edition 2',
        published: 2018,
        author: 'Martin Fowler',
        id: 'afa5de00-344d-11e9-a414-719c6709cf3e',
        genres: ['refactoring'],
    },
    {
        title: 'Refactoring to patterns',
        published: 2008,
        author: 'Joshua Kerievsky',
        id: 'afa5de01-344d-11e9-a414-719c6709cf3e',
        genres: ['refactoring', 'patterns'],
    },
    {
        title: 'Practical Object-Oriented Design, An Agile Primer Using Ruby',
        published: 2012,
        author: 'Sandi Metz',
        id: 'afa5de02-344d-11e9-a414-719c6709cf3e',
        genres: ['refactoring', 'design'],
    },
    {
        title: 'Crime and punishment',
        published: 1866,
        author: 'Fyodor Dostoevsky',
        id: 'afa5de03-344d-11e9-a414-719c6709cf3e',
        genres: ['classic', 'crime'],
    },
    {
        title: 'The Demon ',
        published: 1872,
        author: 'Fyodor Dostoevsky',
        id: 'afa5de04-344d-11e9-a414-719c6709cf3e',
        genres: ['classic', 'revolution'],
    },
];

const typeDefs = gql`
    type Book {
        title: String!
        author: String!
        published: String!
        genres: [String!]!
        id: ID!
    }
    type Author {
        name: String!
        born: Int
        bookCount: Int!
        id: ID!
    }

    type Query {
        bookCount: Int!
        authorCount: Int!
        allBooks(author: String, genre: String): [Book!]!
        allAuthors: [Author!]!
    }

    type Mutation {
        addBook(
            title: String!
            author: String!
            published: Int!
            genres: [String!]!
        ): Book
        editAuthor(name: String!, setBornTo: Int!): Author
    }
`;

const resolvers = {
    Query: {
        bookCount: () => books.length,
        authorCount: () => authors.length,
        allBooks: (root, args) => {
            if (!args.author && !args.genre) {
                return books;
            }
            const byAuthor = () =>
                books.filter((book) => book.author === args.author);
            const byGenre = () =>
                books.filter((book) => book.genres.includes(args.genre));
            // if there is `author` in the args and `genre` not
            if (!args.genre) {
                return byAuthor();
            }
            // if there is `genre` in the args and `author` not
            if (!args.author) {
                console.log('here');
                return byGenre();
            }
            // if both included, also remove duplicated values from array
            const resArray = [...byAuthor(), ...byGenre()];
            // creates an Map([[key, value]]) obj with `id` key, and value as `book`
            // There can't be same two items in the Map of with same key which is `id`
            // Get values() as a iterator obj and return it as an array
            return [
                ...new Map(resArray.map((book) => [book['id'], book])).values(),
            ];
        },
        allAuthors: () => authors,
    },
    Author: {
        // we can modify every field's query
        bookCount: (root) => {
            const booksOfAuthor = books.filter(
                (book) => book.author === root.name
            );
            return booksOfAuthor.length;
        },
    },
    Mutation: {
        addBook: (root, args) => {
            const author = authors.find(
                (author) => author.name === args.author
            );
            if (!author) {
                // there is no author in datastore same with in args
                const newAuthor = { name: args.author, id: uuid() };
                authors = [...authors, newAuthor];
            }
            const book = { ...args, id: uuid() };
            books = [...books, book];
            return book;
        },
        editAuthor: (root, args) => {
            const author = authors.find((author) => author.name === args.name);
            if (!author) {
                // there is no author in datastore same with in args
                return null;
            }
            author.born = args.setBornTo;
            return author;
        },
    },
};

const server = new ApolloServer({
    typeDefs,
    resolvers,
});

server.listen().then(({ url }) => {
    console.log(`Server ready at ${url}`);
});
