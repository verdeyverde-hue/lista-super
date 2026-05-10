 import { useState, useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Plus, 
  Trash2, 
  ShoppingBasket, 
  CheckCircle2, 
  Circle, 
  RotateCcw,
  Sparkles,
  ChevronRight,
  Store,
  Leaf
} from 'lucide-react';

// Estructura de cada producto
interface Item {
  id: string;
  name: string;
  category: 'Almacén' | 'Verdulería';
  checked: boolean;
}

export default function App() {
  // Estados de la app
  const [items, setItems] = useState<Item[]>([]);
  const [itemName, setItemName] = useState('');
  const [category, setCategory] = useState<'Almacén' | 'Verdulería'>('Almacén');
  const [memory, setMemory] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Cargar datos guardados al iniciar
  useEffect(() => {
    const savedItems = localStorage.getItem('family_list_items');
    const savedMemory = localStorage.getItem('family_list_memory');
    
    if (savedItems) setItems(JSON.parse(savedItems));
    if (savedMemory) setMemory(JSON.parse(savedMemory));
  }, []);

  // Guardar cada vez que cambie algo
  useEffect(() => {
    localStorage.setItem('family_list_items', JSON.stringify(items));
  }, [items]);

  useEffect(() => {
    localStorage.setItem('family_list_memory', JSON.stringify(memory));
  }, [memory]);

  // Lógica de sugerencias (Autocompletado)
  const suggestions = useMemo(() => {
    if (!itemName.trim()) return [];
    return memory
      .filter(m => m.toLowerCase().includes(itemName.toLowerCase()) && m.toLowerCase() !== itemName.toLowerCase())
      .slice(0, 5);
  }, [itemName, memory]);

  // Agregar producto
  const addItem = (nameToUse?: string) => {
    const finalName = (nameToUse || itemName).trim();
    if (!finalName) return;

    const newItem: Item = {
      id: crypto.randomUUID(),
      name: finalName,
      category,
      checked: false
    };

    setItems([...items, newItem]);
    
    // Guardar en la "memoria" si es un nombre nuevo
    if (!memory.some(m => m.toLowerCase() === finalName.toLowerCase())) {
      setMemory(prev => [...prev, finalName]);
    }

    setItemName('');
    setShowSuggestions(false);
    inputRef.current?.focus();
  };

  const toggleItem = (id: string) => {
    setItems(items.map(item => 
      item.id === id ? { ...item, checked: !item.checked } : item
    ));
  };

  const removeItem = (id: string) => {
    setItems(items.filter(item => item.id !== id));
  };

  const clearCheckedItems = () => {
    setItems(items.filter(item => !item.checked));
  };

  const clearList = () => {
    if (window.confirm('¿Seguro que quieres borrar la lista actual? Esto no borrará la memoria de productos.')) {
      setItems([]);
    }
  };

  // Organizar la lista para mostrarla
  const getSortedItems = (type: string) => {
    return items
      .filter(i => i.category === type)
      .sort((a, b) => {
        if (a.checked === b.checked) return 0;
        return a.checked ? 1 : -1; // Los tachados van al final
      });
  };

  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-900 font-sans pb-24">
      {/* Cabecera */}
      <header className="bg-white border-b border-neutral-200 sticky top-0 z-20 px-4 py-6 shadow-sm">
        <div className="max-w-md mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-orange-500 p-2.5 rounded-2xl shadow-lg">
              <ShoppingBasket className="text-white w-6 h-6" />
            </div>
            <h1 className="text-2xl font-bold">Súper Familiar</h1>
          </div>
          
          {items.length > 0 && (
            <div className="flex gap-2">
              {items.some(i => i.checked) && (
                <button 
                  onClick={clearCheckedItems}
                  className="flex items-center gap-2 text-orange-600 bg-orange-50 p-3 rounded-xl"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              )}
              <button 
                onClick={clearList}
                className="flex items-center gap-2 text-neutral-400 bg-neutral-100 p-3 rounded-xl"
              >
                <RotateCcw className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>
      </header>

      <main className="max-w-md mx-auto px-4 py-8">
        {/* Campo de Entrada */}
        <section className="bg-white rounded-3xl p-6 shadow-lg mb-8 border border-neutral-100">
          <div className="flex flex-col gap-4">
            <div className="relative">
              <input
                ref={inputRef}
                type="text"
                value={itemName}
                onChange={(e) => {
                  setItemName(e.target.value);
                  setShowSuggestions(true);
                }}
                onKeyPress={(e) => e.key === 'Enter' && addItem()}
                placeholder="¿Qué falta comprar?"
                className="w-full bg-neutral-100 border-none rounded-2xl py-4 px-5 text-lg outline-none"
              />
              
              {/* Sugerencias de Autocompletado */}
              <AnimatePresence>
                {showSuggestions && suggestions.length > 0 && (
                  <motion.div 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute z-10 w-full mt-2 bg-white rounded-2xl border shadow-2xl overflow-hidden"
                  >
                    {suggestions.map((suggestion) => (
                      <button
                        key={suggestion}
                        onClick={() => addItem(suggestion)}
                        className="w-full text-left px-5 py-4 hover:bg-orange-50 flex items-center justify-between"
                      >
                        <span className="font-medium">{suggestion}</span>
                        <ChevronRight className="w-4 h-4 text-neutral-300" />
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Selector de Categoría */}
            <div className="flex gap-2">
              <button
                onClick={() => setCategory('Almacén')}
                className={`flex-1 py-4 rounded-2xl font-bold flex items-center justify-center gap-2 border-2 ${
                  category === 'Almacén' ? 'bg-neutral-900 border-neutral-900 text-white' : 'bg-white border-neutral-100'
                }`}
              >
                <Store className="w-5 h-5" /> Almacén
              </button>
              <button
                onClick={() => setCategory('Verdulería')}
                className={`flex-1 py-4 rounded-2xl font-bold flex items-center justify-center gap-2 border-2 ${
                  category === 'Verdulería' ? 'bg-green-600 border-green-600 text-white' : 'bg-white border-neutral-100'
                }`}
              >
                <Leaf className="w-5 h-5" /> Verdulería
              </button>
            </div>

            <button
              onClick={() => addItem()}
              disabled={!itemName.trim()}
              className="w-full bg-orange-500 text-white py-4 rounded-2xl font-bold text-lg flex items-center justify-center gap-2 shadow-lg disabled:bg-neutral-200"
            >
              <Plus className="w-6 h-6" /> Agregar
            </button>
          </div>
        </section>

        {/* Lista Dividida por Categorías */}
        <div className="space-y-12">
          {['Almacén', 'Verdulería'].map(cat => {
            const sectionItems = getSortedItems(cat);
            if (sectionItems.length === 0) return null;

            return (
              <div key={cat} className="space-y-4">
                <h2 className="text-sm font-bold uppercase tracking-widest text-neutral-400 px-2">
                  {cat === 'Almacén' ? '🥫 Almacén' : '🥬 Verdulería'}
                </h2>

                <div className="space-y-3">
                  <AnimatePresence mode="popLayout">
                    {sectionItems.map((item) => (
                      <motion.div
                        key={item.id}
                        layout
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className={`flex items-center gap-4 bg-white p-5 rounded-2xl shadow-sm border ${
                          item.checked ? 'opacity-50' : 'border-white'
                        }`}
                      >
                        <button onClick={() => toggleItem(item.id)}>
                          {item.checked ? <CheckCircle2 className="w-8 h-8 text-orange-500" /> : <Circle className="w-8 h-8 text-neutral-300" />}
                        </button>
                        <span 
                          className={`flex-1 text-xl font-bold ${item.checked ? 'line-through text-neutral-400' : ''}`}
                          onClick={() => toggleItem(item.id)}
                        >
                          {item.name}
                        </span>
                        <button onClick={() => removeItem(item.id)} className="text-neutral-300">
                          <Trash2 className="w-6 h-6" />
                        </button>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
}
