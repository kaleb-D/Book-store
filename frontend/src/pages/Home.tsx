import React, { useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, Sparkles, ArrowRight } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import project8 from "@/assets/project8.jpg";

export default function Home() {
  const [christianBooks, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // 1. Logic Fix: Re-structured fetch to properly normalize data
  const fetchBooks = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('http://localhost:5000/api/books');
      if (!response.ok) throw new Error('Failed to fetch');
      const result = await response.json();
      
      // Ensure we always have an array
      const books = Array.isArray(result) ? result : result.data || [];
      
      const normalized = books.map(book => ({
        ...book,
        image: book.coverImage || book.image || '',
        types: Array.isArray(book.types) ? book.types : (book.category ? [book.category] : []),
        status: book.status || { label: 'New Release' }
      }));

      setBooks(normalized);
    } catch (err) {
      setError(err.message);
      console.error("Fetch Error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  // 2. Logic Fix: Filtered lists update automatically when christianBooks changes
  const newArrivals = christianBooks.filter(book => book.publishedYear > 2000);
  const christianLiving = christianBooks.filter(book => book.types?.includes("christian living"));
  const featured = christianBooks.filter(book => book.featured);
  const children = christianBooks.filter(book => book.types?.includes("children"));
  const youth = christianBooks.filter(book => book.types?.includes("Youth"));

  // 3. Logic Fix: Specific Refs for different sections
  const newArrivalsRef = useRef(null);
  const livingRef = useRef(null);
  const featuredRef = useRef(null);
  const childrenRef = useRef(null);
  const youthRef = useRef(null);

  const scroll = (ref, direction) => {
    if (ref.current) {
      ref.current.scrollLeft += direction === 'left' ? -300 : 300;
    }
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-screen bg-cover bg-center bg-no-repeat bg-fixed" style={{ backgroundImage: `url(${project8})` }}>
        <div className="flex items-center justify-center min-h-screen bg-black/40">
          <div className="text-center text-white px-4">
            <h1 className="text-4xl md:text-6xl font-bold mb-4">Christian Book Store</h1>
            <p className="text-xl mb-8">Discover Wisdom. Strengthen Your Walk.</p>
            <Button size="lg" asChild>
              <Link to="/Book">Explore Books <ArrowRight className="ml-2" /></Link>
            </Button>
            {error && <p className="text-red-500 mt-4">{error}</p>}
          </div>
        </div>
      </section>

      {/* New Arrivals Section */}
      <section className="px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold flex items-center gap-2 text-secondary-foreground">
            <Sparkles className="text-yellow-400" size={24} /> New Arrivals
          </h2>
          <div className="flex gap-2">
            <Button variant="outline" size="icon" onClick={() => scroll(newArrivalsRef, 'left')} className="rounded-full bg-secondary hover:bg-primary-glow">
              <ChevronLeft size={20} />
            </Button>
            <Button variant="outline" size="icon" onClick={() => scroll(newArrivalsRef, 'right')} className="rounded-full bg-secondary hover:bg-primary-glow">
              <ChevronRight size={20} />
            </Button>
          </div>
        </div>

        <div ref={newArrivalsRef} className="flex flex-nowrap gap-6 overflow-x-auto scroll-smooth no-scrollbar pb-4">
          {newArrivals.map((book) => (
            <Card key={book._id || book.id} className="min-w-[200px] max-w-[200px] flex-shrink-0 bg-primary-foreground border-secondary overflow-hidden hover-glow transition-all">
              <div className="relative h-64">
                <img src={book.image} alt={book.title} className="w-full h-full object-cover" />
                <Badge className="absolute top-2 right-2 bg-primary">{book.status.label}</Badge>
              </div>
              <div className="p-3">
                <h3 className="text-xl font-medium text-primary truncate">{book.title}</h3>
                <p className="text-sm text-muted-foreground mt-1">New Release</p>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* Christian Living Section */}
      <section className="px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold flex items-center gap-2 text-secondary-foreground">
            <Sparkles className="text-yellow-400" size={24} /> Christian Living
          </h2>
          <div className="flex gap-2">
            <Button variant="outline" size="icon" onClick={() => scroll(livingRef, 'left')} className="rounded-full bg-secondary hover:bg-primary-glow">
              <ChevronLeft size={20} />
            </Button>
            <Button variant="outline" size="icon" onClick={() => scroll(livingRef, 'right')} className="rounded-full bg-secondary hover:bg-primary-glow">
              <ChevronRight size={20} />
            </Button>
          </div>
        </div>

        <div ref={livingRef} className="flex flex-nowrap gap-6 overflow-x-auto scroll-smooth no-scrollbar pb-4">
          {christianLiving.map((book) => (
            <Card key={book._id || book.id} className="min-w-[200px] max-w-[200px] flex-shrink-0 bg-primary-foreground border-secondary overflow-hidden hover-glow transition-all">
              <div className="relative h-64">
                <img src={book.image} alt={book.title} className="w-full h-full object-cover" />
                <Badge className="absolute top-2 right-2 bg-primary">{book.status.label}</Badge>
              </div>
              <div className="p-3">
                <h3 className="text-xl font-medium text-primary truncate">{book.title}</h3>
                <p className="text-sm text-muted-foreground mt-1">Faith Journey</p>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* Featured Section */}
      <section className="px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold flex items-center gap-2 text-secondary-foreground">
            <Sparkles className="text-yellow-400" size={24} /> Featured Books
          </h2>
          <div className="flex gap-2">
            <Button variant="outline" size="icon" onClick={() => scroll(featuredRef, 'left')} className="rounded-full bg-secondary hover:bg-primary-glow">
              <ChevronLeft size={20} />
            </Button>
            <Button variant="outline" size="icon" onClick={() => scroll(featuredRef, 'right')} className="rounded-full bg-secondary hover:bg-primary-glow">
              <ChevronRight size={20} />
            </Button>
          </div>
        </div>

        <div ref={featuredRef} className="flex flex-nowrap gap-6 overflow-x-auto scroll-smooth no-scrollbar pb-4">
          {featured.map((book) => (
            <Card key={book._id || book.id} className="min-w-[200px] max-w-[200px] flex-shrink-0 bg-primary-foreground border-secondary overflow-hidden hover-glow transition-all">
              <div className="relative h-64">
                <img src={book.image} alt={book.title} className="w-full h-full object-cover" />
                <Badge className="absolute top-2 right-2 bg-primary">{book.status.label}</Badge>
              </div>
              <div className="p-3">
                <h3 className="text-xl font-medium text-primary truncate">{book.title}</h3>
                <p className="text-sm text-muted-foreground mt-1">Featured</p>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* Children Section */}
      <section className="px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold flex items-center gap-2 text-secondary-foreground">
            <Sparkles className="text-yellow-400" size={24} /> Children
          </h2>
          <div className="flex gap-2">
            <Button variant="outline" size="icon" onClick={() => scroll(childrenRef, 'left')} className="rounded-full bg-secondary hover:bg-primary-glow">
              <ChevronLeft size={20} />
            </Button>
            <Button variant="outline" size="icon" onClick={() => scroll(childrenRef, 'right')} className="rounded-full bg-secondary hover:bg-primary-glow">
              <ChevronRight size={20} />
            </Button>
          </div>
        </div>

        <div ref={childrenRef} className="flex flex-nowrap gap-6 overflow-x-auto scroll-smooth no-scrollbar pb-4">
          {children.map((book) => (
            <Card key={book._id || book.id} className="min-w-[200px] max-w-[200px] flex-shrink-0 bg-primary-foreground border-secondary overflow-hidden hover-glow transition-all">
              <div className="relative h-64">
                <img src={book.image} alt={book.title} className="w-full h-full object-cover" />
                <Badge className="absolute top-2 right-2 bg-primary">{book.status.label}</Badge>
              </div>
              <div className="p-3">
                <h3 className="text-xl font-medium text-primary truncate">{book.title}</h3>
                <p className="text-sm text-muted-foreground mt-1">Children</p>
              </div>
            </Card>
          ))}
        </div>
      </section>
      {/* Youth Section */}
      <section className="px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold flex items-center gap-2 text-secondary-foreground">
            <Sparkles className="text-yellow-400" size={24} />Youth
          </h2>
          <div className="flex gap-2">
            <Button variant="outline" size="icon" onClick={() => scroll(youthRef, 'left')} className="rounded-full bg-secondary hover:bg-primary-glow">
              <ChevronLeft size={20} />
            </Button>
            <Button variant="outline" size="icon" onClick={() => scroll(youthRef, 'right')} className="rounded-full bg-secondary hover:bg-primary-glow">
              <ChevronRight size={20} />
            </Button>
          </div>
        </div>

        <div ref={youthRef} className="flex flex-nowrap gap-6 overflow-x-auto scroll-smooth no-scrollbar pb-4">
          {youth.map((book) => (
            <Card key={book._id || book.id} className="min-w-[200px] max-w-[200px] flex-shrink-0 bg-primary-foreground border-secondary overflow-hidden hover-glow transition-all">
              <div className="relative h-64">
                <img src={book.image} alt={book.title} className="w-full h-full object-cover" />
                <Badge className="absolute top-2 right-2 bg-primary">{book.status.label}</Badge>
              </div>
              <div className="p-3">
                <h3 className="text-xl font-medium text-primary truncate">{book.title}</h3>
                <p className="text-sm text-muted-foreground mt-1">Youth</p>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* Quick Stats Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card className="p-6 text-center hover-glow">
            <div className="text-3xl font-bold text-primary mb-2">150+</div>
            <div className="text-muted-foreground">Books</div>
          </Card>
          <Card className="p-6 text-center hover-glow">
            <div className="text-3xl font-bold text-primary mb-2">100%</div>
            <div className="text-muted-foreground">Christian related books</div>
          </Card>
        </div>
      </section>
    </div>
  );
}