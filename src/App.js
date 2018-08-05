import React from 'react'
import { Link, Route } from 'react-router-dom'
import * as BooksAPI from './BooksAPI'
import BookList from './BookList'
import './App.css'

class BooksApp extends React.Component {
    state = {
      books: [],
      bookSearch: [],
      query: ''
    }

    // Initial async call to the API, then re-renders when the call completes

    componentDidMount() {
      BooksAPI.getAll().then((books) => {
        this.setState({
          books
        })
      })
    }

    /*  Changes the shelf property of an individual book by matching the object
        but seemingly reliant on the id as the primary key. Redirects to home if
        the user is on search. 
    */

    updateBooksAPI = (newShelf, bookToUpdate) => {
      BooksAPI.update(bookToUpdate, newShelf)
        .then(() => {
          BooksAPI.getAll().then((books) => {
            this.setState({
              books
            })
          })
        })
    }

    /*  Basic trim method used but could add better escapement of characters. Also
        error handling is based on the returned object from BooksAPI, this could be
        handled within BooksAPI.js. However the error responses are ultimately valid,
        even if they're unwanted and unused in this case.
    */

    updateQuery = (query) => {
      this.setState({
        query: query
      })
      if (query !== ''){
      BooksAPI.search(query.trim())
        .then((searchResponse) => {
          if ('error' in searchResponse && 'error' in searchResponse.books) {
            return Promise.reject(new Error())
          } else {
            return Promise.resolve(searchResponse)
          }
        })
        .then(success => {
          this.setState({
            bookSearch: success
          })
          this.addShelvesToSearchBook()
        })
        .catch(() => {
          this.setState({
            bookSearch: []
          })
        })}
    }

    /*  Search results from the API don't have a shelf field. So instead
        this method matches up any existing book shelf properties with
        the search results added to state.
    */

    addShelvesToSearchBook = () => {
      this.setState((state) => ({
        bookSearch: state.bookSearch.map(book => {
          book.shelf = 'none'
          for (let bookShelf of state.books) {
            if (bookShelf.id === book.id) {
              book.shelf = bookShelf.shelf
            }
          }
          return book
        })
      }))
    }

  render() {
    return (
      <div className="app">
        <Route path="/search" exact render={() => (
          <div className="search-books">
            <div className="search-books-bar">
              <Link to="/" className="close-search" >
                Close
              </Link>
              <div className="search-books-input-wrapper">
                <input 
                type="text" 
                placeholder="Search by title or author"
                value={this.state.query}
                onChange={(event) => this.updateQuery(event.target.value)}
                />
              </div>
            </div>
            <div className="search-books-results">
              <ol className="books-grid">
              <BookList bookList={this.state.bookSearch} isSearch={true} updateShelf={this.updateBooksAPI} />
              </ol>
            </div>
          </div>
        )}/>
        <Route path="/" exact render={() => (
          <div className="list-books">
            <div className="list-books-title">
              <h1>MyReads</h1>
            </div>
            <div className="list-books-content">
              <div>
                <div className="bookshelf">
                  <h2 className="bookshelf-title">Currently Reading</h2>
                  <div className="bookshelf-books">
                    <BookList bookList={this.state.books.filter(book => book.shelf === 'currentlyReading')} updateShelf={this.updateBooksAPI} />
                  </div>
                </div>
                <div className="bookshelf">
                  <h2 className="bookshelf-title">Want to Read</h2>
                  <div className="bookshelf-books">
                    <BookList bookList={this.state.books.filter(book => book.shelf === 'wantToRead')} updateShelf={this.updateBooksAPI}  />
                  </div>
                </div>
                <div className="bookshelf">
                  <h2 className="bookshelf-title">Read</h2>
                  <div className="bookshelf-books">
                    <BookList bookList={this.state.books.filter(book => book.shelf === 'read')} updateShelf={this.updateBooksAPI} />
                  </div>
                </div>
              </div>
            </div>
            <div className="open-search">
              <Link to="/search" className="search-page" >
                Add a book
              </Link>
            </div>
          </div>
        )}/>
      </div>
    )
  }
}

export default BooksApp