# Exercises

## Exercises 8.1.-8.7 : [library-backend](https://github.com/jokerinya/fsopen-part8/tree/main/library-backend)

> ## Exercises 8.8.-8.12.

Through these exercises, we'll implement a frontend for the GraphQL library.

Take [this project](https://github.com/fullstack-hy2020/library-frontend) as a start for your application.

You can implement your application either using the render prop components Query and Mutation of the Apollo Client, or using the hooks provided by Apollo client 3.0.

## 8.8: Authors view

Implement an Authors view to show the details of all authors on a page as follows:

![Authors View](./readmeimg/16.png)

## 8.9: Books view

Implement a Books view to show on a page all other details of all books except their genres.

![Book view](./readmeimg/17.png)

## 8.10: Adding a book

Implement a possibility to add new books to your application. The functionality can look like this:

![Add a Book](./readmeimg/18.png)

Make sure that the Authors and Books views are kept up to date after a new book is added.

In case of problems when making queries or mutations, check from the developer console what the server response is:

![Error](./readmeimg/42ea.png)

## 8.11: Authors birth year

Implement a possibility to set authors birth year. You can create a new view for setting the birth year, or place it on the Authors view:

![Authors birth year](./readmeimg/20.png)

## 8.12: Authors birth year advanced

Change the birth year form so that a birth year can be set only for an existing author. Use [select tag](https://reactjs.org/docs/forms.html#the-select-tag), [react select](https://github.com/JedWatson/react-select), or some other mechanism.

A solution using the react select library looks as follows:

![Advanced birth year](./readmeimg/21.png)

## Exercises 8.13.-8.16 : [library-backend](https://github.com/jokerinya/fsopen-part8/tree/main/library-backend)

> ## Exercises 8.17.-8.22.

## 8.17 Listing books

After the backend changes, the list of books does not work anymore. Fix it.
