import React, { useEffect, useMemo, useState } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Activity, BookOpen, Users, Edit3, Trash2, Plus, MessageCircle } from "lucide-react";

const categories = [
  'Bible',
  'Theology',
  'Devotionals',
  'christian living',
  'Youth',
  'children',
  'Leadership',
  'Apologetics',
  'History',
];

const emptyBookForm = {
  title: '',
  author: '',
  description: '',
  category: 'Bible',
  coverImage: '',
  liveURL: '',
  downloadURL: '',
  publishedYear: '',
  pages: '',
  featured: false,
};

export default function Services() {
  const [adminToken, setAdminToken] = useState(() => localStorage.getItem('adminToken') || '');
  const [selectedTab, setSelectedTab] = useState<'dashboard' | 'books' | 'users' | 'contacts'>('dashboard');
  const [stats, setStats] = useState<any>(null);
  const [books, setBooks] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [contacts, setContacts] = useState<any[]>([]);
  const [bookForm, setBookForm] = useState<any>(emptyBookForm);
  const [bookImageFile, setBookImageFile] = useState<File | null>(null);
  const [editingBookId, setEditingBookId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const authHeaders = useMemo(() => {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    if (adminToken) {
      headers.Authorization = `Bearer ${adminToken}`;
    }
    return headers;
  }, [adminToken]);

  useEffect(() => {
    if (adminToken) {
      localStorage.setItem('adminToken', adminToken);
      fetchAll();
    } else {
      localStorage.removeItem('adminToken');
    }
  }, [adminToken]);

  const fetchAll = async () => {
    await Promise.all([fetchStats(), fetchBooks(), fetchUsers(), fetchContacts()]);
  };

  const fetchStats = async () => {
    if (!adminToken) return;
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('http://localhost:5000/api/admin/stats', {
        headers: authHeaders,
      });
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result?.error || 'Unable to load admin stats');
      }

      setStats(result.data);
    } catch (err: any) {
      setError(err.message || 'Error loading stats');
    } finally {
      setLoading(false);
    }
  };

  const fetchBooks = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('http://localhost:5000/api/books');
      const result = await response.json();
      const booksData = Array.isArray(result) ? result : result.data || [];
      setBooks(booksData);
    } catch (err: any) {
      setError(err.message || 'Error loading books');
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    if (!adminToken) return;
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('http://localhost:5000/api/admin/users', {
        headers: authHeaders,
      });
      const result = await response.json();

      if (!response.ok) {
        console.error('Fetch Users Error:', result);
        throw new Error(result?.error || 'Unable to load users');
      }

      setUsers(result.data || []);
    } catch (err: any) {
      setError(err.message || 'Error loading users');
    } finally {
      setLoading(false);
    }
  };

  const fetchContacts = async () => {
    if (!adminToken) return;
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('http://localhost:5000/api/contact', {
        headers: authHeaders,
      });
      const result = await response.json();

      if (!response.ok) {
        console.error('Fetch Contacts Error:', result);
        throw new Error(result?.error || 'Unable to load contacts');
      }

      setContacts(result.data || []);
    } catch (err: any) {
      setError(err.message || 'Error loading contacts');
    } finally {
      setLoading(false);
    }
  };

  const handleBookFormChange = (field: string, value: string | boolean) => {
    setBookForm(prev => ({ ...prev, [field]: value }));
  };

  const resetBookForm = () => {
    setBookForm(emptyBookForm);
    setBookImageFile(null);
    setEditingBookId(null);
    setMessage(null);
    setError(null);
  };

  const handleBookSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!adminToken) {
      setError('Admin token required for book management');
      return;
    }

    setLoading(true);
    setError(null);
    setMessage(null);

    const formData = new FormData();
    formData.append('title', bookForm.title);
    formData.append('author', bookForm.author);
    formData.append('description', bookForm.description);
    formData.append('category', bookForm.category);
    if (bookForm.publishedYear) {
      formData.append('publishedYear', bookForm.publishedYear);
    }
    if (bookForm.pages) {
      formData.append('pages', bookForm.pages);
    }
    formData.append('featured', String(Boolean(bookForm.featured)));
    if (bookForm.liveURL) {
      formData.append('liveURL', bookForm.liveURL);
    }
    if (bookForm.downloadURL) {
      formData.append('downloadURL', bookForm.downloadURL);
    }

    if (bookImageFile) {
      formData.append('coverImage', bookImageFile);
    } else if (bookForm.coverImage) {
      formData.append('coverImage', bookForm.coverImage);
    }

    try {
      const url = editingBookId
        ? `http://localhost:5000/api/books/${editingBookId}`
        : 'http://localhost:5000/api/books';
      const method = editingBookId ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          Authorization: `Bearer ${adminToken}`,
        },
        body: formData,
      });
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result?.error || result?.message || 'Book save failed');
      }

      setMessage(editingBookId ? 'Book updated successfully' : 'Book created successfully');
      resetBookForm();
      await fetchBooks();
    } catch (err: any) {
      setError(err.message || 'Error saving book');
    } finally {
      setLoading(false);
    }
  };

  const handleBookEdit = (book: any) => {
    setEditingBookId(book._id || book.id || null);
    setBookForm({
      title: book.title || '',
      author: book.author || '',
      description: book.description || '',
      category: book.category || 'Bible',
      coverImage: book.coverImage || book.image || '',
      liveURL: book.liveURL || '',
      downloadURL: book.downloadURL || '',
      publishedYear: book.publishedYear?.toString() || '',
      pages: book.pages?.toString() || '',
      featured: Boolean(book.featured),
    });
    setBookImageFile(null);
    setSelectedTab('books');
  };

  const handleBookDelete = async (bookId: string) => {
    if (!adminToken) {
      setError('Admin token required for delete');
      return;
    }
    if (!window.confirm('Delete this book permanently?')) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`http://localhost:5000/api/books/${bookId}`, {
        method: 'DELETE',
        headers: authHeaders,
      });
      const result = await response.json();
      if (!response.ok) {
        throw new Error(result?.error || 'Delete failed');
      }
      setMessage('Book deleted successfully');
      await fetchBooks();
    } catch (err: any) {
      setError(err.message || 'Error deleting book');
    } finally {
      setLoading(false);
    }
  };

  const handleUserRole = async (userId: string, role: 'user' | 'admin') => {
    if (!adminToken) {
      setError('Admin token required to update roles');
      return;
    }
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`http://localhost:5000/api/admin/users/${userId}/role`, {
        method: 'PATCH',
        headers: authHeaders,
        body: JSON.stringify({ role }),
      });
      const result = await response.json();
      if (!response.ok) {
        throw new Error(result?.error || 'Role update failed');
      }
      setMessage('User role updated');
      await fetchUsers();
    } catch (err: any) {
      setError(err.message || 'Error updating user role');
    } finally {
      setLoading(false);
    }
  };

  const handleContactStatus = async (contactId: string, status: 'unread' | 'read' | 'responded') => {
    if (!adminToken) {
      setError('Admin token required to update contact status');
      return;
    }
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`http://localhost:5000/api/contact/${contactId}/status`, {
        method: 'PATCH',
        headers: authHeaders,
        body: JSON.stringify({ status }),
      });
      const result = await response.json();
      if (!response.ok) {
        throw new Error(result?.error || 'Status update failed');
      }
      setMessage('Contact status updated');
      await fetchContacts();
    } catch (err: any) {
      setError(err.message || 'Error updating contact status');
    } finally {
      setLoading(false);
    }
  };

  const handleContactDelete = async (contactId: string) => {
    if (!adminToken) {
      setError('Admin token required for contact deletion');
      return;
    }
    if (!window.confirm('Delete this contact submission permanently?')) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`http://localhost:5000/api/contact/${contactId}`, {
        method: 'DELETE',
        headers: authHeaders,
      });
      const result = await response.json();
      if (!response.ok) {
        throw new Error(result?.error || 'Delete failed');
      }
      setMessage('Contact deleted successfully');
      await fetchContacts();
    } catch (err: any) {
      setError(err.message || 'Error deleting contact');
    } finally {
      setLoading(false);
    }
  };

  const handleFileDownload = (fileUrl: string, fileName: string) => {
    const a = document.createElement('a');
    a.href = fileUrl;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const noToken = !adminToken;

  return (
    <div className="min-h-screen pt-20 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto max-w-7xl">
        <div className="flex flex-col gap-6 mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-4xl font-bold mb-2">Admin Dashboard</h1>
              <p className="text-muted-foreground max-w-2xl">
                Use this page to monitor store stats, manage books, and update user roles.
                Paste your admin bearer token below to enable protected actions.
              </p>
            </div>
            <div className="flex flex-col gap-3 w-full md:w-[420px]">
              <label className="text-sm font-medium text-muted-foreground">Admin Bearer Token</label>
              <input
                type="text"
                value={adminToken}
                onChange={e => setAdminToken(e.target.value)}
                className="w-full rounded-lg border border-secondary bg-background px-4 py-3 text-sm text-primary outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                placeholder="Paste admin token here"
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {['dashboard', 'books', 'users', 'contacts'].map(tab => (
              <Button
                key={tab}
                variant={selectedTab === tab ? 'secondary' : 'outline'}
                onClick={() => setSelectedTab(tab as 'dashboard' | 'books' | 'users' | 'contacts')}
              >
                {tab === 'dashboard' ? 'Dashboard' : tab === 'books' ? 'Books' : tab === 'users' ? 'Users' : 'Contacts'}
              </Button>
            ))}
          </div>

          {(message || error) && (
            <Card className="p-4">
              {message && <p className="text-sm text-emerald-500">{message}</p>}
              {error && <p className="text-sm text-red-500">{error}</p>}
            </Card>
          )}
        </div>

        {noToken && (
          <Card className="mb-8 border border-yellow-400 bg-yellow-500/10 text-yellow-900">
            <div className="p-5">
              <h2 className="font-semibold text-lg">Admin token required</h2>
              <p className="text-sm text-muted-foreground">
                Protected admin actions (stats, book create/edit/delete, user role updates) require a valid bearer token.
              </p>
            </div>
          </Card>
        )}

        {selectedTab === 'dashboard' && (
          <section className="grid gap-6 lg:grid-cols-3 mb-8">
            <Card className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <Activity className="h-6 w-6 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">Total Users</p>
                  <p className="text-3xl font-semibold">{stats?.totalUsers ?? '—'}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 mb-4">
                <BookOpen className="h-6 w-6 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">Total Books</p>
                  <p className="text-3xl font-semibold">{stats?.totalBooks ?? '—'}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <MessageCircle className="h-6 w-6 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">Open Contacts</p>
                  <p className="text-3xl font-semibold">{stats?.unreadContacts ?? '—'}</p>
                </div>
              </div>
            </Card>
            <Card className="p-6">
              <div className="mb-4">
                <p className="text-sm text-muted-foreground">Recent Registrations (30 days)</p>
                <p className="text-3xl font-semibold">{stats?.recentRegistrations ?? '—'}</p>
              </div>
              <div className="mb-4">
                <p className="text-sm text-muted-foreground">Total Contacts</p>
                <p className="text-3xl font-semibold">{stats?.totalContacts ?? '—'}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Inventory</p>
                <p className="text-lg font-semibold">Stock: {stats?.inventory?.totalStock ?? '—'}</p>
                <p className="text-lg font-semibold">Value: ${stats?.inventory?.totalValue?.toLocaleString() ?? '—'}</p>
              </div>
            </Card>
            <Card className="p-6">
              <div className="mb-4">
                <p className="text-sm text-muted-foreground">Books by Category</p>
                {stats?.booksByCategory?.length ? (
                  <div className="space-y-2 mt-4">
                    {stats.booksByCategory.map((item: any) => (
                      <div key={item._id} className="flex items-center justify-between">
                        <span className="text-sm text-primary">{item._id || 'Unknown'}</span>
                        <Badge variant="secondary">{item.count}</Badge>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground mt-2">No category stats available.</p>
                )}
              </div>
            </Card>
          </section>
        )}

        {selectedTab === 'books' && (
          <section className="space-y-8 mb-8">
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-semibold">Manage Books</h2>
                  <p className="text-sm text-muted-foreground">Create or edit books in the collection.</p>
                </div>
                <Button variant="outline" onClick={resetBookForm}>
                  <Plus className="mr-2 h-4 w-4" /> New Book
                </Button>
              </div>
              <form onSubmit={handleBookSubmit} className="grid gap-4 sm:grid-cols-2">
                <label className="block">
                  <span className="text-sm text-muted-foreground">Title</span>
                  <input
                    value={bookForm.title}
                    onChange={e => handleBookFormChange('title', e.target.value)}
                    className="mt-1 w-full rounded-lg border border-secondary bg-background px-3 py-2 text-sm text-primary outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                  />
                </label>
                <label className="block">
                  <span className="text-sm text-muted-foreground">Author</span>
                  <input
                    value={bookForm.author}
                    onChange={e => handleBookFormChange('author', e.target.value)}
                    className="mt-1 w-full rounded-lg border border-secondary bg-background px-3 py-2 text-sm text-primary outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                  />
                </label>
                <label className="block sm:col-span-2">
                  <span className="text-sm text-muted-foreground">Description</span>
                  <textarea
                    value={bookForm.description}
                    onChange={e => handleBookFormChange('description', e.target.value)}
                    rows={4}
                    className="mt-1 w-full rounded-lg border border-secondary bg-background px-3 py-2 text-sm text-primary outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                  />
                </label>
                <label className="block">
                  <span className="text-sm text-muted-foreground">Category</span>
                  <select
                    value={bookForm.category}
                    onChange={e => handleBookFormChange('category', e.target.value)}
                    className="mt-1 w-full rounded-lg border border-secondary bg-background px-3 py-2 text-sm text-primary outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                  >
                    {categories.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </label>
                <label className="block">
                  <span className="text-sm text-muted-foreground">Cover Image URL</span>
                  <input
                    value={bookForm.coverImage}
                    onChange={e => handleBookFormChange('coverImage', e.target.value)}
                    className="mt-1 w-full rounded-lg border border-secondary bg-background px-3 py-2 text-sm text-primary outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                  />
                </label>
                <label className="block">
                  <span className="text-sm text-muted-foreground">Upload Cover Image</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={e => setBookImageFile(e.target.files?.[0] || null)}
                    className="mt-1 w-full rounded-lg border border-secondary bg-background px-3 py-2 text-sm text-primary outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                  />
                  <p className="mt-2 text-xs text-muted-foreground">Choose a local image to upload, or leave empty to use the URL above.</p>
                </label>
                <label className="block">
                  <span className="text-sm text-muted-foreground">Download URL</span>
                  <input
                    value={bookForm.downloadURL}
                    onChange={e => handleBookFormChange('downloadURL', e.target.value)}
                    className="mt-1 w-full rounded-lg border border-secondary bg-background px-3 py-2 text-sm text-primary outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                  />
                </label>
                <label className="block">
                  <span className="text-sm text-muted-foreground">Live URL</span>
                  <input
                    value={bookForm.liveURL}
                    onChange={e => handleBookFormChange('liveURL', e.target.value)}
                    className="mt-1 w-full rounded-lg border border-secondary bg-background px-3 py-2 text-sm text-primary outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                  />
                </label>
                <label className="block">
                  <span className="text-sm text-muted-foreground">Published Year</span>
                  <input
                    type="number"
                    value={bookForm.publishedYear}
                    onChange={e => handleBookFormChange('publishedYear', e.target.value)}
                    className="mt-1 w-full rounded-lg border border-secondary bg-background px-3 py-2 text-sm text-primary outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                  />
                </label>
                <label className="block">
                  <span className="text-sm text-muted-foreground">Pages</span>
                  <input
                    type="number"
                    value={bookForm.pages}
                    onChange={e => handleBookFormChange('pages', e.target.value)}
                    className="mt-1 w-full rounded-lg border border-secondary bg-background px-3 py-2 text-sm text-primary outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                  />
                </label>
                <label className="flex items-center gap-3 sm:col-span-2">
                  <input
                    type="checkbox"
                    checked={bookForm.featured}
                    onChange={e => handleBookFormChange('featured', e.target.checked)}
                    className="h-4 w-4 rounded border-secondary text-primary focus:ring-primary"
                  />
                  <span className="text-sm text-muted-foreground">Featured book</span>
                </label>
                <div className="sm:col-span-2 flex flex-wrap gap-3">
                  <Button type="submit" disabled={loading}>
                    {editingBookId ? 'Update Book' : 'Create Book'}
                  </Button>
                  <Button type="button" variant="outline" onClick={resetBookForm}>
                    Reset
                  </Button>
                </div>
              </form>
            </Card>

            <Card className="p-6 overflow-x-auto">
              <h3 className="text-xl font-semibold mb-4">Books</h3>
              <div className="grid gap-4">
                {books.length ? books.map(book => (
                  <div key={book._id || book.id} className="flex flex-col gap-3 rounded-xl border border-secondary p-4 bg-background">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                      <div>
                        <p className="font-semibold">{book.title}</p>
                        <p className="text-sm text-muted-foreground">{book.author} · {book.category}</p>
                      </div>
                      <div className="flex flex-wrap items-center gap-2">
                        {book.featured && <Badge variant="secondary">Featured</Badge>}
                        <Badge>{book.publishedYear || 'N/A'}</Badge>
                      </div>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                      <Button variant="outline" size="sm" onClick={() => handleBookEdit(book)}>
                        <Edit3 className="mr-2 h-4 w-4" /> Edit
                      </Button>
                      <Button variant="destructive" size="sm" onClick={() => handleBookDelete(book._id || book.id)}>
                        <Trash2 className="mr-2 h-4 w-4" /> Delete
                      </Button>
                    </div>
                  </div>
                )) : (
                  <p className="text-sm text-muted-foreground">No books found. Create a new book above.</p>
                )}
              </div>
            </Card>
          </section>
        )}

        {selectedTab === 'users' && (
          <section className="space-y-6 mb-8">
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-semibold">Manage Users</h2>
                  <p className="text-sm text-muted-foreground">View user list and update roles.</p>
                </div>
                <Badge variant="secondary">{users.length} users</Badge>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-border text-left text-sm">
                  <thead>
                    <tr>
                      <th className="px-4 py-3 font-medium">Name</th>
                      <th className="px-4 py-3 font-medium">Email</th>
                      <th className="px-4 py-3 font-medium">Role</th>
                      <th className="px-4 py-3 font-medium">Created</th>
                      <th className="px-4 py-3 font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {users.length ? users.map(user => (
                      <tr key={user._id || user.id}>
                        <td className="px-4 py-3">{user.name || 'No name'}</td>
                        <td className="px-4 py-3">{user.email}</td>
                        <td className="px-4 py-3">
                          <Badge variant={user.role === 'admin' ? 'secondary' : 'default'}>
                            {user.role}
                          </Badge>
                        </td>
                        <td className="px-4 py-3">{new Date(user.createdAt).toLocaleDateString()}</td>
                        <td className="px-4 py-3 flex flex-wrap gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            disabled={user.role === 'admin'}
                            onClick={() => handleUserRole(user._id || user.id, 'admin')}
                          >
                            Promote
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            disabled={user.role === 'user'}
                            onClick={() => handleUserRole(user._id || user.id, 'user')}
                          >
                            Demote
                          </Button>
                        </td>
                      </tr>
                    )) : (
                      <tr>
                        <td className="px-4 py-6 text-sm text-muted-foreground" colSpan={5}>No users available.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </Card>
          </section>
        )}

        {selectedTab === 'contacts' && (
          <section className="space-y-6 mb-8">
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-semibold">Manage Contacts</h2>
                  <p className="text-sm text-muted-foreground">View and manage contact form submissions.</p>
                </div>
                <Badge variant="secondary">{contacts.length} contacts</Badge>
              </div>
              <div className="space-y-4">
                {contacts.length ? contacts.map(contact => (
                  <Card key={contact._id} className="p-4">
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-semibold">{contact.name}</h3>
                          <Badge variant={
                            contact.status === 'unread' ? 'destructive' :
                            contact.status === 'read' ? 'default' : 'secondary'
                          }>
                            {contact.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-1">{contact.email}</p>
                        <p className="font-medium mb-2">{contact.subject}</p>
                        <p className="text-sm text-muted-foreground mb-3">{contact.message}</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(contact.createdAt).toLocaleString()}
                        </p>
                        {(contact.document || contact.audioNote) && (
                          <div className="mt-3 space-y-2">
                            {contact.document && (
                              <div className="flex items-center gap-2 p-2 bg-blue-50 rounded border">
                                <span className="text-sm text-blue-800 flex-1">📄 {contact.document.originalName}</span>
                                <div className="flex gap-1">
                                  <button
                                    type="button"
                                    onClick={() => window.open(`http://localhost:5000${contact.document.path}`, "_blank")}
                                    className="text-xs px-2 py-1 h-7 rounded border border-secondary bg-background text-primary hover:bg-secondary/10"
                                  >
                                    ↓
                                  </button>
                                </div>
                              </div>
                            )}
                            {contact.audioNote && (
                              <div className="flex items-center gap-2 p-2 bg-green-50 rounded border">
                                <span className="text-sm text-green-800 flex-1">🎵 {contact.audioNote.originalName}</span>
                                <div className="flex gap-1">
                                  <button
                                    type="button"
                                    onClick={() => window.open(`http://localhost:5000${contact.audioNote.path}`, "_blank")}
                                    className="text-xs px-2 py-1 h-7 rounded border border-secondary bg-background text-primary hover:bg-secondary/10"
                                  >
                                    ↓
                                  </button>
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {contact.status === 'unread' && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleContactStatus(contact._id, 'read')}
                          >
                            Mark Read
                          </Button>
                        )}
                        {contact.status === 'read' && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleContactStatus(contact._id, 'responded')}
                          >
                            Mark Responded
                          </Button>
                        )}
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleContactDelete(contact._id)}
                        >
                          Delete
                        </Button>
                      </div>
                    </div>
                  </Card>
                )) : (
                  <p className="text-sm text-muted-foreground text-center py-8">No contact submissions yet.</p>
                )}
              </div>
            </Card>
          </section>
        )}
      </div>

    </div>
  );
}
