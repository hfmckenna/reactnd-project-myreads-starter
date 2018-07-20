import React from 'react'
import * as BooksAPI from './BooksAPI'
import './App.css'

class BookList extends React.Component {

  render() {
    return (
        <ol className="books-grid">
        {this.props.bookList.map(book => (
            <li key={ book.id }>
            <div className="book">
                <div className="book-top">
                <div className="book-cover" style={{ width: 128, height: 193, backgroundImage: `url(${book.imageLinks.smallThumbnail})` }}></div>
                <div className="book-shelf-changer">
                    <select value={book.shelf} onChange={(event) => this.props.updateShelf(event.target.value, book)}>
                        <option value="move" disabled>Move to...</option>
                        <option value="currentlyReading">Currently Reading</option>
                        <option value="wantToRead">Want to Read</option>
                        <option value="read">Read</option>
                        <option value="none">None</option>
                    </select>
                </div>
                </div>
                <div className="book-title">{ book.title }</div>
                <div className="book-authors">{ book.authors.join(', ') }</div>
            </div>
            </li>
                )
            )
        }
        </ol>
        )
    }
}

export default BookList