import { useState, useEffect } from 'react';
import { Edit2, Trash2, Save, X } from 'lucide-react';
import { projectId, publicAnonKey } from '/utils/supabase/info';

interface BuffetEntry {
  id: string;
  name: string;
  dish: string;
  createdAt: string;
  updatedAt?: string;
}

const API_BASE = `https://${projectId}.supabase.co/functions/v1/make-server-99a48398`;

export default function App() {
  const [entries, setEntries] = useState<BuffetEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState('');
  const [dish, setDish] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [editDish, setEditDish] = useState('');

  // Fetch entries
  const fetchEntries = async () => {
    try {
      const response = await fetch(`${API_BASE}/entries`, {
        headers: {
          'Authorization': `Bearer ${publicAnonKey}`,
        },
      });
      const data = await response.json();
      if (data.entries) {
        setEntries(data.entries);
      }
    } catch (error) {
      console.error('Fehler beim Laden der Einträge:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEntries();
  }, []);

  // Add new entry
  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !dish.trim()) return;

    try {
      const response = await fetch(`${API_BASE}/entries`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publicAnonKey}`,
        },
        body: JSON.stringify({ name: name.trim(), dish: dish.trim() }),
      });

      if (response.ok) {
        setName('');
        setDish('');
        await fetchEntries();
      } else {
        console.error('Fehler beim Hinzufügen:', await response.json());
      }
    } catch (error) {
      console.error('Fehler beim Hinzufügen:', error);
    }
  };

  // Start editing
  const startEdit = (entry: BuffetEntry) => {
    setEditingId(entry.id);
    setEditName(entry.name);
    setEditDish(entry.dish);
  };

  // Cancel editing
  const cancelEdit = () => {
    setEditingId(null);
    setEditName('');
    setEditDish('');
  };

  // Save edit
  const handleEdit = async (id: string) => {
    if (!editName.trim() || !editDish.trim()) return;

    try {
      const response = await fetch(`${API_BASE}/entries/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publicAnonKey}`,
        },
        body: JSON.stringify({ name: editName.trim(), dish: editDish.trim() }),
      });

      if (response.ok) {
        setEditingId(null);
        setEditName('');
        setEditDish('');
        await fetchEntries();
      } else {
        console.error('Fehler beim Bearbeiten:', await response.json());
      }
    } catch (error) {
      console.error('Fehler beim Bearbeiten:', error);
    }
  };

  // Delete entry
  const handleDelete = async (id: string) => {
    if (!confirm('Möchten Sie diesen Eintrag wirklich löschen?')) return;

    try {
      const response = await fetch(`${API_BASE}/entries/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${publicAnonKey}`,
        },
      });

      if (response.ok) {
        await fetchEntries();
      } else {
        console.error('Fehler beim Löschen:', await response.json());
      }
    } catch (error) {
      console.error('Fehler beim Löschen:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 py-4 md:py-8 px-3 md:px-4">
      <div className="max-w-4xl mx-auto">
        {/* Event Info Header */}
        <div className="bg-white rounded-xl md:rounded-2xl shadow-xl p-4 md:p-8 mb-6 md:mb-8 border-2 md:border-4 border-green-200">
          <div className="text-center">
            <h1 className="text-2xl md:text-4xl font-bold text-black mb-3 md:mb-4">Osterfest Buffet</h1>
            <div className="space-y-2 text-base md:text-lg text-gray-700">
              <p className="flex flex-col md:flex-row items-center justify-center md:gap-2">
                <span className="font-semibold">Datum:</span>
                <span>Gründonnerstag, 2. April 2026</span>
              </p>
              <p className="flex flex-col md:flex-row items-center justify-center md:gap-2">
                <span className="font-semibold">Uhrzeit:</span>
                <span>ab 18 Uhr</span>
              </p>
              <p className="flex flex-col md:flex-row items-center justify-center md:gap-2">
                <span className="font-semibold">Ort:</span>
                <span>Lauenburger Straße 2, 21379 Echem</span>
              </p>
            </div>
          </div>
        </div>

        {/* Add Entry Form */}
        <div className="bg-white rounded-xl md:rounded-2xl shadow-lg p-4 md:p-6 mb-6 md:mb-8">
          <h2 className="text-xl md:text-2xl font-semibold text-gray-800 mb-3 md:mb-4">
            Neuen Beitrag hinzufügen
          </h2>
          <form onSubmit={handleAdd} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Dein Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="z.B. Maria"
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-green-500 focus:outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Was bringst du mit?
                </label>
                <input
                  type="text"
                  value={dish}
                  onChange={(e) => setDish(e.target.value)}
                  placeholder="z.B. Kartoffelsalat"
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-green-500 focus:outline-none"
                  required
                />
              </div>
            </div>
            <button
              type="submit"
              className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
            >
              Eintragen
            </button>
          </form>
        </div>

        {/* Entries List */}
        <div className="bg-white rounded-xl md:rounded-2xl shadow-lg p-4 md:p-6">
          <h2 className="text-xl md:text-2xl font-semibold text-gray-800 mb-3 md:mb-4">
            Buffet-Liste ({entries.length} {entries.length === 1 ? 'Beitrag' : 'Beiträge'})
          </h2>

          {loading ? (
            <div className="text-center py-8 text-gray-500">Lädt...</div>
          ) : entries.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p className="text-base md:text-lg">Noch keine Einträge vorhanden.</p>
              <p className="text-sm mt-2">Sei der Erste und trage dich ein!</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b-2 border-gray-300">
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Name</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Bringt mit</th>
                    <th className="text-right py-3 px-4 font-semibold text-gray-700">Aktionen</th>
                  </tr>
                </thead>
                <tbody>
                  {entries.map((entry) => (
                    <tr
                      key={entry.id}
                      className="border-b border-gray-200 hover:bg-green-50 transition-colors"
                    >
                      {editingId === entry.id ? (
                        // Edit Mode
                        <>
                          <td className="py-3 px-4">
                            <input
                              type="text"
                              value={editName}
                              onChange={(e) => setEditName(e.target.value)}
                              className="w-full px-3 py-2 border-2 border-green-300 rounded-lg focus:border-green-500 focus:outline-none"
                              placeholder="Name"
                            />
                          </td>
                          <td className="py-3 px-4">
                            <input
                              type="text"
                              value={editDish}
                              onChange={(e) => setEditDish(e.target.value)}
                              className="w-full px-3 py-2 border-2 border-green-300 rounded-lg focus:border-green-500 focus:outline-none"
                              placeholder="Gericht"
                            />
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex gap-2 justify-end">
                              <button
                                onClick={() => handleEdit(entry.id)}
                                className="p-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors"
                                title="Speichern"
                              >
                                <Save size={18} />
                              </button>
                              <button
                                onClick={cancelEdit}
                                className="p-2 bg-gray-400 hover:bg-gray-500 text-white rounded-lg transition-colors"
                                title="Abbrechen"
                              >
                                <X size={18} />
                              </button>
                            </div>
                          </td>
                        </>
                      ) : (
                        // View Mode
                        <>
                          <td className="py-3 px-4 font-medium text-gray-800">{entry.name}</td>
                          <td className="py-3 px-4 text-gray-700">{entry.dish}</td>
                          <td className="py-3 px-4">
                            <div className="flex gap-2 justify-end">
                              <button
                                onClick={() => startEdit(entry)}
                                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                title="Bearbeiten"
                              >
                                <Edit2 size={18} />
                              </button>
                              <button
                                onClick={() => handleDelete(entry.id)}
                                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                title="Löschen"
                              >
                                <Trash2 size={18} />
                              </button>
                            </div>
                          </td>
                        </>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-gray-600">
          <p className="text-sm">
            Wir freuen uns auf ein gemütliches Beisammensein!
          </p>
        </div>
      </div>
    </div>
  );
}
