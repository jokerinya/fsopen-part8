// 3rd party
const {
    ApolloServer,
    gql,
    UserInputError,
    AuthenticationError,
} = require('apollo-server');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
// config
const {
    DB_USER_NAME,
    DB_USER_PASSWORD,
    DB_CLUSTER_ADDRESS,
    DB_NAME,
    JWT_SECRET,
} = require('./utils/config');
// models
const Book = require('./models/book');
const Author = require('./models/author');
const User = require('./models/user');

require('dotenv').config();

// Connect to db
(async () => {
    try {
        await mongoose.connect(
            `mongodb+srv://${DB_USER_NAME}:${DB_USER_PASSWORD}@${DB_CLUSTER_ADDRESS}/${DB_NAME}?retryWrites=true&w=majority`
        );
        console.log('Connected to db');
    } catch (error) {
        console.log(error);
    }
})();

const typeDefs = gql`
    type Author {
        name: String!
        born: Int
        bookCount: Int!
        id: ID!
    }

    type Book {
        title: String!
        author: Author!
        published: Int!
        genres: [String!]!
        id: ID!
    }

    type User {
        username: String!
        favouriteGenre: String!
        id: ID!
    }

    type Token {
        value: String!
    }

    type Query {
        bookCount: Int!
        authorCount: Int!
        allBooks(author: String, genre: String): [Book!]!
        allAuthors: [Author!]!
        me: User
    }

    type Mutation {
        addBook(
            title: String!
            author: String!
            published: Int!
            genres: [String!]!
        ): Book!
        editAuthor(name: String!, setBornTo: Int!): Author
        createUser(username: String!, favouriteGenre: String!): User
        login(username: String!, password: String!): Token
    }
`;

const resolvers = {
    Query: {
        bookCount: async () => Book.collection.countDocuments(),
        authorCount: async () => Author.collection.countDocuments(),
        allBooks: async (root, args) => {
            // If there is no argument
            if (!args.author && !args.genre) {
                return Book.find({}).populate('author');
            }
            // if there is `author` in the args and `genre` not
            if (args.author && !args.genre) {
                const author = await Author.findOne({ name: args.author });
                return await Book.find({ author });
                // return byAuthor();
            }
            // if there is `genre` in the args and `author` not
            if (!args.author && args.genre) {
                return await Book.find({ genres: { $in: [args.genre] } });
            }
            // Both arguments
            const author = await Author.findOne({ name: args.author });
            if (!author) {
                return [];
            }
            return await Book.find({
                author: author.id,
                genres: { $in: [args.genre] },
            });
        },
        allAuthors: async () => Author.find({}),
        me: (root, args, context) => {
            return context.currentUser;
        },
    },
    Author: {
        // we can modify every field's query
        bookCount: async (root) => {
            const author = await Author.find({ name: root.name });
            const booksOfAuthor = await Book.countDocuments({ author });
            return booksOfAuthor;
        },
    },
    Mutation: {
        addBook: async (root, args, context) => {
            const currentUser = context.currentUser;
            if (!currentUser) {
                throw new AuthenticationError('not authenticated');
            }
            // find if the author has been added or if not create a new one and save it
            const author =
                (await Author.findOne({ name: args.author })) ||
                new Author({ name: args.author });
            try {
                await author.save();
            } catch (error) {
                throw new UserInputError(error.message, {
                    invalidArgs: { author: args.author },
                });
            }
            // book adding
            const book = new Book({ ...args, author });
            try {
                await book.save();
            } catch (error) {
                throw new UserInputError(error.message, {
                    invalidArgs: args,
                });
            }
            return book;
        },
        editAuthor: async (root, args, context) => {
            const currentUser = context.currentUser;
            if (!currentUser) {
                throw new AuthenticationError('not authenticated');
            }
            const author = await Author.findOne({ name: args.name });
            if (!author) {
                // there is no author in datastore same with in args
                return null;
            }
            author.born = args.setBornTo;
            try {
                await author.save();
            } catch (error) {
                throw new UserInputError(error.message, {
                    invalidArgs: { setBornTo: args.setBornTo },
                });
            }
            return author;
        },
        createUser: async (root, args) => {
            const user = new User({ ...args });
            try {
                await user.save();
            } catch (error) {
                throw new UserInputError(error.message, {
                    invalidArgs: { ...args },
                });
            }
            return user;
        },
        login: async (root, args) => {
            const user = await User.findOne({ username: args.username });
            if (!user || args.password !== 'secret') {
                throw new UserInputError('wrong credentials');
            }

            const useForToken = {
                username: user.username,
                id: user._id,
            };

            return { value: jwt.sign(useForToken, JWT_SECRET) };
        },
    },
};

const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: async ({ req }) => {
        const auth = req ? req.headers.authorization : null;
        if (auth && auth.toLowerCase().startsWith('bearer ')) {
            const decodedToken = jwt.verify(auth.substring(7), JWT_SECRET);
            const currentUser = await User.findById(decodedToken.id);
            return { currentUser };
        }
    },
});

server.listen().then(({ url }) => {
    console.log(`Server ready at ${url}`);
});
