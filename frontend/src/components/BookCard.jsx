// Simple book card showing metadata and actions for borrow/return/admin edit/delete.

import { Link } from 'react-router-dom'

export default function BookCard({ book, isAdmin, canReturn, isOverdue, onBorrow, onReturn, onDelete }) {
  return (
    <div className={`card h-full flex flex-col ${isOverdue ? 'border border-red-400' : ''}`}>
      <div className="flex-1">
        <h3 className="text-lg font-semibold">{book.title}</h3>
        <p className="text-sm text-gray-600">by {book.author}</p>
        {book.category && <p className="text-sm mt-1">Category: <span className="font-medium">{book.category}</span></p>}
      </div>
      <div className="mt-3 flex items-center justify-between">
        <span className={`badge ${book.status === 'available' ? 'badge-green' : 'badge-red'}`}>
          {book.status}
        </span>
        {isOverdue && <span className="badge badge-red">Overdue</span>}
      </div>
      <div className="mt-3 flex gap-2">
        {book.status === 'available' && (
          <button className="btn btn-primary flex-1" onClick={onBorrow}>Borrow</button>
        )}
        {book.status === 'borrowed' && canReturn && (
          <button className="btn btn-primary flex-1" onClick={onReturn}>Return</button>
        )}
        {isAdmin && (
          <>
            <Link className="btn btn-secondary flex-1" to={`/books/${book._id}/edit`}>Edit</Link>
            <button className="btn btn-secondary flex-1" onClick={onDelete}>Delete</button>
          </>
        )}
      </div>
    </div>
  )
}


