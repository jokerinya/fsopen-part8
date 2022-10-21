// 3rd party
const { UserInputError, AuthenticationError } = require('apollo-server');
const jwt = require('jsonwebtoken');
// ws
const { PubSub } = require('graphql-subscriptions');
const pubSub = new PubSub();
// config
const { JWT_SECRET } = require('./utils/config');
// models
const Book = require('./models/book');
const Author = require('./models/author');
const User = require('./models/user');

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
                return await Book.find({ author }).populate('author');
                // return byAuthor();
            }
            // if there is `genre` in the args and `author` not
            if (!args.author && args.genre) {
                return await Book.find({
                    genres: { $in: [args.genre] },
                }).populate('author');
            }
            // Both arguments
            const author = await Author.findOne({ name: args.author });
            if (!author) {
                return [];
            }
            return await Book.find({
                author: author.id,
                genres: { $in: [args.genre] },
            }).populate('author');
        },
        allAuthors: async () => Author.find({}).populate('books'),
        me: (root, args, context) => {
            return context.currentUser;
        },
    },
    Author: {
        // we can modify every field's query
        bookCount: async (root) => {
            // const author = await Author.find({ name: root.name });
            // const booksOfAuthor = await Book.countDocuments({ author });
            // return booksOfAuthor;
            return root.books.length;
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
                // add book to authors list
                await author.updateOne({ $push: { books: book } });
            } catch (error) {
                throw new UserInputError(error.message, {
                    invalidArgs: args,
                });
            }
            // ws subscription
            pubSub.publish('BOOK_ADDED', { bookAdded: book });
            return await book.populate('author');
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
    Subscription: {
        bookAdded: {
            subscribe: () => pubSub.asyncIterator('BOOK_ADDED'),
        },
    },
};

module.exports = resolvers;
