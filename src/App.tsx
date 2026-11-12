import { useBooks } from "./useBooks";

// This is the unstyled starting point. It only shows that the data flows.
// Build your UI here and in new components, see SPEC.md.
export default function App() {
  const { books } = useBooks();

  return (
    <main>
      <h1>Reading List</h1>
      <p>{books.length} books</p>
      <ul>
        {books.map((book) => (
          <li key={book.id}>
            {book.title} by {book.author} ({book.status})
          </li>
        ))}
      </ul>
    </main>
  );
}
