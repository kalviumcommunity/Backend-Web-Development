
import { BrowserRouter, Routes, Route, Link, useParams } from 'react-router-dom'
import './App.css'

const quotes = [
  {
    id: '1',
    text: 'Great things are done by a series of small things brought together.',
    author: 'QuoteBoard Collection',
    category: 'Inspiration',
  },
  {
    id: '2',
    text: 'First, solve the problem. Then, write the code.',
    author: 'QuoteBoard Collection',
    category: 'Programming',
  },
  {
    id: '3',
    text: 'Learning never exhausts the mind.',
    author: 'QuoteBoard Collection',
    category: 'Learning',
  },
]

function Home() {
  return (
    <main className="container">
      <h1>Welcome to QuoteBoard</h1>
      <p className="subtitle">
        Discover inspiring quotes and ideas.
      </p>

      <div className="quote-grid">
        {quotes.map((quote) => (
          <article className="quote-card" key={quote.id}>
            <span className="category">{quote.category}</span>
            <h2>"{quote.text}"</h2>
            <p>— {quote.author}</p>

            <Link to={`/quote/${quote.id}`} className="view-link">
              View Quote →
            </Link>
          </article>
        ))}
      </div>
    </main>
  )
}

function QuoteDetail() {
  const { id } = useParams()
  const quote = quotes.find((item) => item.id === id)

  if (!quote) {
    return (
      <main className="container">
        <h1>Quote not found</h1>
        <Link to="/">Go back home</Link>
      </main>
    )
  }

  return (
    <main className="container detail-page">
      <span className="category">{quote.category}</span>
      <h1>"{quote.text}"</h1>
      <p className="author">— {quote.author}</p>
      <Link to="/" className="view-link">
        ← Back to Home
      </Link>
    </main>
  )
}

function App() {
  return (
    <BrowserRouter>
      <header className="navbar">
        <Link to="/" className="brand">QuoteBoard</Link>
        <Link to="/" className="nav-link">Home</Link>
      </header>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/quote/:id" element={<QuoteDetail />} />
        <Route path="*" element={<Home />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
