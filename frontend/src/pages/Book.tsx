import React, { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { BookOpenText, BookDown } from "lucide-react"

const categories = ["All", "Bible", "Theology", "Devotionals", "christian living", "Youth","children","Leadership","Apologetics", "History"]

export default function Book() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [christianBooks, setBooks] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [visibleCount, setVisibleCount] = useState(8);

  const fetchBooks = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('http://localhost:5000/api/books');
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result?.message || 'Failed to fetch books');
      }

      const books = Array.isArray(result) ? result : result.data || [];
      const normalizedBooks = books.map((book) => ({
        ...book,
        image: book.coverImage || book.image || '',
        types: Array.isArray(book.types)
          ? book.types
          : book.types
          ? [book.types]
          : book.category
          ? [book.category]
          : [],
        liveUrl: book.liveURL || book.liveUrl || '',
        download: book.downloadURL || book.download || '',
        status: book.status || { readers: 0, label: 'No status' },
      }));

      setBooks(normalizedBooks);
    } catch (fetchError) {
      console.error('Error fetching books:', fetchError);
      setError(fetchError instanceof Error ? fetchError.message : String(fetchError));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  const filteredBooks = selectedCategory === "All"
    ? christianBooks
    : christianBooks.filter((book) => book.types.includes(selectedCategory));

  const handleLoadMore = () => {
    setVisibleCount((prevCount) => prevCount + 8);
  };

  const hasMore = visibleCount < filteredBooks.length;

  return (
    <div className="min-h-screen pt-20 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto max-w-7xl">
        {/* Header */}
        <div className="text-center mb-16 animate-fade-up">
          <h1 className="text-4xl sm:text-5xl font-bold mb-6">
            <span className="gradient-text">Christian Books</span>
          </h1>
          <p className="text-xl text max-w-3xl mx-auto">
            “Your word is a lamp to my feet and a light to my path.” – Psalm 119:105
          </p>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Return daily to Scripture and find wisdom, direction, and peace for every journey.
          </p>
          {error && <p className="mt-4 text-sm text-red-300">Error: {error}</p>}
        </div>

        {/* Filter Buttons */}
        <div className="flex flex-wrap justify-center gap-4 mb-12 animate-fade-in">
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              className="hover-glow"
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </Button>
          ))}
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8 mb-16">
          {loading ? (
            <div className="col-span-full text-center text-lg text-muted-foreground">
              Loading books...
            </div>
          ) : filteredBooks.length > 0 ? (
            filteredBooks.slice(0, visibleCount).map((book, index) => (
              <Card
                key={book._id || book.id || book.title}
                className="overflow-hidden hover-glow animate-slide-up group transition-all flex-shrink-0"
                style={{ animationDelay: `${index * 150}ms` }}
              >
                <div className="relative overflow-hidden">
                  <img
                    src={book.image}
                    alt={book.title}
                    className="w-full h-48 object-fill transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute top-2 right-2">
                    <Badge variant="default" className="text-xs">
                      {book.status?.label || 'No status'}
                    </Badge>
                  </div>
                </div>

                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">
                    {book.title}
                  </h3>
                  <p className="text-muted-foreground mb-4 text-sm">{book.description}</p>

                  <div className="flex flex-wrap gap-1 mb-4">
                    {(book.types || []).slice(0, 3).map((type) => (
                      <Badge key={type} variant="secondary" className="text-xs">
                        {type}
                      </Badge>
                    ))}
                    {(book.types || []).length > 3 && (
                      <Badge variant="secondary" className="text-xs">
                        +{(book.types || []).length - 3}
                      </Badge>
                    )}
                  </div>

                  <div className="space-y-1 mb-6">
                    <div className="flex items-center text-xs">
                      <span className="text-muted-foreground">Author</span>
                      <span className="text-muted-foreground"> : </span>
                      <span className="text-muted-foreground">{book.author}</span>
                    </div>
                    <div className="flex items-center text-xs">
                      <span className="text-muted-foreground">Published Year</span>
                      <span className="text-muted-foreground"> : </span>
                      <span className="text-muted-foreground">{book.publishedYear}</span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" className="flex-1" asChild>
                      <a href={book.liveUrl} target="_blank" rel="noopener noreferrer">
                        <BookOpenText className="w-3 h-3 mr-1" />
                        READ
                      </a>
                    </Button>
                    <Button size="sm" className="flex-1" asChild>
                      <a href={book.download} target="_blank" rel="noopener noreferrer">
                        <BookDown className="w-3 h-3 mr-1" />
                        Download
                      </a>
                    </Button>
                  </div>
                </div>
              </Card>
            ))
          ) : (
            <div className="col-span-full text-center text-sm text-muted-foreground">
              No books available.
            </div>
          )}
        </div>

        {hasMore && (
          <div className="text-center animate-fade-up">
            <Button variant="outline" size="lg" className="hover-glow" onClick={handleLoadMore}>
              Load More Books
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
