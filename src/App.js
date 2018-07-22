import React from 'react'
import * as BooksAPI from './BooksAPI'
import BookList from './BookList'
import './App.css'

class BooksApp extends React.Component {
    state = {
      books: [],
      bookSearch: [],
      query: '',
      showSearchPage: window.location.href === 'http://localhost:3000/search' ? true : false
    }

    // Initial async call to the API, then re-renders when the call completes

    componentDidMount() {
      BooksAPI.getAll().then((books) => {
        this.setState({
          books
        })
      })
    }

    updateBooksAPI = (newShelf, bookToUpdate) => {
      BooksAPI.update(bookToUpdate, newShelf)
        .then(() => {
          BooksAPI.getAll().then((books) => {
            this.setState({
              books
            })
          }).then(() => {if (this.state.showSearchPage) {
            window.location.href = 'http://localhost:3000/'
          }})
        })
    }

    updateQuery = (query) => {
      this.setState({
        query: query.trim()
      })
      BooksAPI.search(query)
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
        })
    }

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
        {this.state.showSearchPage ? (
          <div className="search-books">
            <div className="search-books-bar">
              <a className="close-search" onClick={() => window.location.href = 'http://localhost:3000'}>Close</a>
              <div className="search-books-input-wrapper">
                {/*
                  NOTES: The search from BooksAPI is limited to a particular set of search terms.
                  You can find these search terms here:
                  https://github.com/udacity/reactnd-project-myreads-starter/blob/master/SEARCH_TERMS.md

                  However, remember that the BooksAPI.search method DOES search by title or author. So, don't worry if
                  you don't find a specific author or title. Every search is limited by search terms.
                */
                }
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
        ) : (
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
              <a onClick={() => window.location.href = 'http://localhost:3000/search'}>Add a book</a>
            </div>
          </div>
        )}
      </div>
    )
  }
}

export default BooksApp
