# Exercises

## Exercises 8.1.-8.7.

Through the exercises, we will implement a GraphQL backend for a small library. Start with [this file](https://github.com/fullstack-hy2020/misc/blob/master/library-backend.js). Remember to `npm init` and to install dependencies!

Note that the code does not initially work since the schema definition is not complete.

## 8.1: The number of books and authors

Implement queries bookCount and authorCount which return the number of books and the number of authors.

The query

```graphql
query {
    bookCount
    authorCount
}
```

should return

```json
{
    "data": {
        "bookCount": 7,
        "authorCount": 5
    }
}
```

## 8.1: The number of books and authors

Implement queries bookCount and authorCount which return the number of books and the number of authors.

The query

```graphql
query {
    bookCount
    authorCount
}
```

should return

```json
{
    "data": {
        "bookCount": 7,
        "authorCount": 5
    }
}
```
