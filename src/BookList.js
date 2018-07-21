import React from 'react'
import './App.css'

class BookList extends React.Component {

  render() {
    const createReadableShelves = (bookShelf) => {
        if (bookShelf === 'none') {
            return 'Shelf: None';
        }
        else if (bookShelf === 'currentlyReading') {
            return 'Shelf: Currently Reading';
        }
        else if (bookShelf === 'wantToRead') {
            return 'Shelf: Want To Read';
        }
        else if (bookShelf === 'read') {
            return 'Shelf: Read';
        }
    }

    return (
        <ol className="books-grid">
        {this.props.bookList.map(book => (
            <li key={ book.id }>
            <div className="book">
                <div className="book-top">
                <div className="book-cover" style={
                    { width: 128, height: 193, backgroundImage: `url(${'imageLinks' in book ? book.imageLinks.smallThumbnail : ''})` }}></div>
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
                <div className="book-extra-info">{this.props.isSearch ? createReadableShelves(book.shelf) : book.publisher}</div>
                <div className="book-authors">{ book.authors ? book.authors.join(', ') : '' }</div>
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