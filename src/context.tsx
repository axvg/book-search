import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

const URL = "http://openlibrary.org/search.json?title=";
const AppContext = createContext({});

function AppProvider({ children }: any) {
  const [searchTerm, setSearchTerm] = useState("random book");
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [resultTitle, setResultTitle] = useState("");

  const fetchBooks = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`${URL}${searchTerm}`);
      const data = await res.json();

      const { docs } = data;

      if (docs) {
        const newBooks = docs.slice(0, 20).map((book: any) => {
          const { key, author, cover, edition, year, title } = book;

          return {
            id: key,
            author,
            cover_id: cover,
            edition_count: edition,
            first_publish_year: year,
            title,
          };
        });

        setBooks(newBooks);

        if (newBooks.length > 1) {
          setResultTitle("Your search result: ");
        } else {
          setResultTitle("No search result found!");
        }
      } else {
        setBooks([]);
        setResultTitle("No search result found!");
      }
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  }, [searchTerm]);

  useEffect(() => {
    fetchBooks();
  }, [searchTerm, fetchBooks]);

  return (
    <AppContext.Provider
      value={{
        loading,
        books,
        setSearchTerm,
        resultTitle,
        setResultTitle,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export const useGlobalContext = () => {
  return useContext(AppContext);
};

export { AppContext, AppProvider };
