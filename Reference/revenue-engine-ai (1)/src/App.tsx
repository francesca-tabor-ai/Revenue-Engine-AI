import React, { useState, useEffect } from 'react';
import { 
  BarChart3, 
  Users, 
  Target, 
  MessageSquare, 
  TrendingUp, 
  Plus, 
  ChevronRight, 
  Settings, 
  Send, 
  CheckCircle2, 
  AlertCircle,
  Zap,
  LayoutDashboard,
  FileText,
  UserPlus,
  ArrowRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line
} from 'recharts';
import ReactMarkdown from 'react-markdown';
import { architectAgent, outreachAgent, replyIntelligenceAgent, authorityBuilderAgent } from './services/gemini';
import { Product, ICP, Contact, Stats } from './types';

// --- Components ---

const SidebarItem = ({ icon: Icon, label, active, onClick }: { icon: any, label: string, active: boolean, onClick: () => void }) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
      active 
        ? 'bg-black text-white shadow-lg' 
        : 'text-zinc-500 hover:bg-zinc-100 hover:text-black'
    }`}
  >
    <Icon size={20} />
    <span className="font-medium">{label}</span>
  </button>
);

const Card = ({ children, className = "" }: { children: React.ReactNode, className?: string }) => (
  <div className={`bg-white border border-zinc-200 rounded-2xl p-6 shadow-sm ${className}`}>
    {children}
  </div>
);

const StatCard = ({ label, value, icon: Icon, trend }: { label: string, value: string | number, icon: any, trend?: string }) => (
  <Card>
    <div className="flex justify-between items-start mb-4">
      <div className="p-2 bg-zinc-50 rounded-lg">
        <Icon size={20} className="text-zinc-600" />
      </div>
      {trend && (
        <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">
          {trend}
        </span>
      )}
    </div>
    <div className="text-2xl font-bold text-zinc-900">{value}</div>
    <div className="text-sm text-zinc-500 mt-1">{label}</div>
  </Card>
);

// --- Main App ---

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [products, setProducts] = useState<Product[]>([]);
  const [currentProduct, setCurrentProduct] = useState<Product | null>(null);
  const [icp, setIcp] = useState<ICP | null>(null);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(false);

  // Onboarding state
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [newProduct, setNewProduct] = useState({ name: '', description: '', hypothesis: '', pricing: '' });

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    if (currentProduct) {
      fetchProductData(currentProduct.id);
    }
  }, [currentProduct]);

  const fetchProducts = async () => {
    const res = await fetch('/api/products');
    const data = await res.json();
    setProducts(data);
    if (data.length > 0 && !currentProduct) {
      setCurrentProduct(data[0]);
    } else if (data.length === 0) {
      setShowOnboarding(true);
    }
  };

  const fetchProductData = async (id: number) => {
    setLoading(true);
    try {
      const [icpRes, contactsRes, statsRes] = await Promise.all([
        fetch(`/api/products/${id}/icp`),
        fetch(`/api/products/${id}/contacts`),
        fetch(`/api/products/${id}/stats`)
      ]);
      setIcp(await icpRes.json());
      setContacts(await contactsRes.json());
      setStats(await statsRes.json());
    } finally {
      setLoading(false);
    }
  };

  const handleCreateProduct = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newProduct)
      });
      const { id } = await res.json();
      
      // Run Architect Agent
      const icpData = await architectAgent(newProduct.description, newProduct.hypothesis);
      await fetch(`/api/products/${id}/icp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(icpData)
      });

      await fetchProducts();
      setShowOnboarding(false);
      setActiveTab('dashboard');
    } finally {
      setLoading(false);
    }
  };

  const renderDashboard = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Outreach Volume" value={stats?.total_outreach || 0} icon={Send} trend="+12%" />
        <StatCard label="Reply Rate" value={`${stats?.total_outreach ? Math.round((stats.total_replies / stats.total_outreach) * 100) : 0}%`} icon={MessageSquare} trend="+5%" />
        <StatCard label="Paying Customers" value={stats?.total_paying || 0} icon={Users} />
        <StatCard label="Total Revenue" value={`£${stats?.total_revenue || 0}`} icon={TrendingUp} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <h3 className="text-lg font-semibold mb-6">Revenue Velocity</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={[{day: 1, rev: 0}, {day: 5, rev: 100}, {day: 10, rev: 450}, {day: 15, rev: 1200}]}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis dataKey="day" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} />
                <Tooltip />
                <Line type="monotone" dataKey="rev" stroke="#000" strokeWidth={2} dot={{ r: 4, fill: '#000' }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card>
          <h3 className="text-lg font-semibold mb-6">Conversion Funnel</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={[
                { name: 'Outreach', value: stats?.total_outreach || 0 },
                { name: 'Replies', value: stats?.total_replies || 0 },
                { name: 'Booked', value: stats?.total_booked || 0 },
                { name: 'Closed', value: stats?.total_paying || 0 },
              ]}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} />
                <Tooltip />
                <Bar dataKey="value" fill="#000" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      <Card className="bg-zinc-900 text-white border-none">
        <div className="flex items-center gap-4 mb-4">
          <Zap className="text-yellow-400" fill="currentColor" />
          <h3 className="text-lg font-semibold">AI Revenue Nudge</h3>
        </div>
        <p className="text-zinc-400 mb-4">
          "Your reply rate for technical founders is 3x higher than for marketing leads. 
          I suggest shifting 80% of today's outreach to the 'Engineering Manager' persona."
        </p>
        <button className="bg-white text-black px-4 py-2 rounded-lg font-medium text-sm hover:bg-zinc-200 transition-colors">
          Apply Optimization
        </button>
      </Card>
    </div>
  );

  const renderICP = () => (
    <div className="max-w-4xl space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">ICP & Offer Architecture</h2>
        <button className="flex items-center gap-2 text-sm font-medium text-zinc-600 hover:text-black">
          <Settings size={16} />
          Refine Strategy
        </button>
      </div>

      {icp ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <h3 className="font-semibold text-zinc-900 mb-2 flex items-center gap-2">
              <Target size={18} className="text-zinc-400" />
              Ideal Customer Persona
            </h3>
            <div className="markdown-body">
              <ReactMarkdown>{icp.persona}</ReactMarkdown>
            </div>
          </Card>
          <Card>
            <h3 className="font-semibold text-zinc-900 mb-2 flex items-center gap-2">
              <AlertCircle size={18} className="text-zinc-400" />
              Pain Mapping
            </h3>
            <div className="markdown-body">
              <ReactMarkdown>{icp.pain_mapping}</ReactMarkdown>
            </div>
          </Card>
          <Card className="md:col-span-2">
            <h3 className="font-semibold text-zinc-900 mb-2 flex items-center gap-2">
              <Zap size={18} className="text-zinc-400" />
              The Transformation
            </h3>
            <div className="markdown-body">
              <ReactMarkdown>{icp.transformation}</ReactMarkdown>
            </div>
          </Card>
          <Card className="md:col-span-2 bg-zinc-50 border-dashed">
            <h3 className="font-semibold text-zinc-900 mb-2 flex items-center gap-2">
              <CheckCircle2 size={18} className="text-emerald-600" />
              Beta Offer
            </h3>
            <div className="markdown-body">
              <ReactMarkdown>{icp.offer}</ReactMarkdown>
            </div>
          </Card>
        </div>
      ) : (
        <Card className="flex flex-col items-center justify-center py-20 text-center">
          <div className="p-4 bg-zinc-100 rounded-full mb-4">
            <Target size={32} className="text-zinc-400" />
          </div>
          <h3 className="text-lg font-semibold">No ICP Defined</h3>
          <p className="text-zinc-500 max-w-xs mt-2">
            Run the Architect Agent to define your ideal customer and offer.
          </p>
        </Card>
      )}
    </div>
  );

  const renderOutreach = () => {
    const [isAdding, setIsAdding] = useState(false);
    const [newContact, setNewContact] = useState({ name: '', company: '', role: '', channel: 'LinkedIn' });

    const handleAddContact = async () => {
      if (!currentProduct) return;
      const res = await fetch(`/api/products/${currentProduct.id}/contacts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newContact)
      });
      if (res.ok) {
        fetchProductData(currentProduct.id);
        setIsAdding(false);
        setNewContact({ name: '', company: '', role: '', channel: 'LinkedIn' });
      }
    };

    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">Outreach Execution</h2>
          <button 
            onClick={() => setIsAdding(true)}
            className="bg-black text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-zinc-800 transition-all"
          >
            <UserPlus size={18} />
            Add Contact
          </button>
        </div>

        <AnimatePresence>
          {isAdding && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <Card className="bg-zinc-50 border-zinc-300">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <input 
                    placeholder="Name" 
                    className="px-3 py-2 rounded-md border border-zinc-300 bg-white"
                    value={newContact.name}
                    onChange={e => setNewContact({...newContact, name: e.target.value})}
                  />
                  <input 
                    placeholder="Company" 
                    className="px-3 py-2 rounded-md border border-zinc-300 bg-white"
                    value={newContact.company}
                    onChange={e => setNewContact({...newContact, company: e.target.value})}
                  />
                  <input 
                    placeholder="Role" 
                    className="px-3 py-2 rounded-md border border-zinc-300 bg-white"
                    value={newContact.role}
                    onChange={e => setNewContact({...newContact, role: e.target.value})}
                  />
                  <div className="flex gap-2">
                    <select 
                      className="flex-1 px-3 py-2 rounded-md border border-zinc-300 bg-white"
                      value={newContact.channel}
                      onChange={e => setNewContact({...newContact, channel: e.target.value})}
                    >
                      <option>LinkedIn</option>
                      <option>Email</option>
                      <option>Twitter</option>
                    </select>
                    <button 
                      onClick={handleAddContact}
                      className="bg-black text-white px-4 py-2 rounded-md"
                    >
                      Save
                    </button>
                  </div>
                </div>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        <Card className="p-0 overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-zinc-50 border-bottom border-zinc-200">
                <th className="px-6 py-4 text-xs font-semibold text-zinc-500 uppercase tracking-wider">Contact</th>
                <th className="px-6 py-4 text-xs font-semibold text-zinc-500 uppercase tracking-wider">Role</th>
                <th className="px-6 py-4 text-xs font-semibold text-zinc-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-xs font-semibold text-zinc-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200">
              {contacts.map(contact => (
                <tr key={contact.id} className="hover:bg-zinc-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-medium text-zinc-900">{contact.name}</div>
                    <div className="text-xs text-zinc-500">{contact.company}</div>
                  </td>
                  <td className="px-6 py-4 text-sm text-zinc-600">{contact.role}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      contact.status === 'paying' ? 'bg-emerald-100 text-emerald-700' :
                      contact.status === 'booked' ? 'bg-blue-100 text-blue-700' :
                      'bg-zinc-100 text-zinc-600'
                    }`}>
                      {contact.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <button className="text-zinc-400 hover:text-black transition-colors">
                      <ChevronRight size={20} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      </div>
    );
  };

  const renderOnboarding = () => (
    <div className="fixed inset-0 bg-white z-50 flex items-center justify-center p-6">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-xl w-full"
      >
        <div className="mb-8 text-center">
          <div className="inline-flex p-3 bg-black text-white rounded-2xl mb-4">
            <Zap size={32} />
          </div>
          <h1 className="text-3xl font-bold mb-2">Welcome to Revenue Engine AI</h1>
          <p className="text-zinc-500">Let's architect your autonomous GTM system.</p>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-1">Product Name</label>
            <input 
              className="w-full px-4 py-3 rounded-xl border border-zinc-200 focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all"
              placeholder="e.g. Acme AI"
              value={newProduct.name}
              onChange={e => setNewProduct({...newProduct, name: e.target.value})}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-1">Product Description</label>
            <textarea 
              className="w-full px-4 py-3 rounded-xl border border-zinc-200 focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all h-24"
              placeholder="What does it do? Who is it for?"
              value={newProduct.description}
              onChange={e => setNewProduct({...newProduct, description: e.target.value})}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-1">Market Hypothesis</label>
            <input 
              className="w-full px-4 py-3 rounded-xl border border-zinc-200 focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all"
              placeholder="e.g. Technical founders struggle with sales outreach"
              value={newProduct.hypothesis}
              onChange={e => setNewProduct({...newProduct, hypothesis: e.target.value})}
            />
          </div>
          <button 
            onClick={handleCreateProduct}
            disabled={loading || !newProduct.name || !newProduct.description}
            className="w-full bg-black text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-zinc-800 transition-all disabled:opacity-50"
          >
            {loading ? 'Architecting Strategy...' : 'Start Revenue Sprint'}
            <ArrowRight size={20} />
          </button>
        </div>
      </motion.div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F8F8F8] text-zinc-900 font-sans">
      {showOnboarding && renderOnboarding()}

      {/* Sidebar */}
      <aside className="fixed left-0 top-0 bottom-0 w-64 bg-white border-r border-zinc-200 p-6 hidden lg:block">
        <div className="flex items-center gap-3 mb-10 px-2">
          <div className="bg-black text-white p-1.5 rounded-lg">
            <Zap size={20} />
          </div>
          <span className="font-bold text-xl tracking-tight">Revenue Engine</span>
        </div>

        <nav className="space-y-2">
          <SidebarItem icon={LayoutDashboard} label="Dashboard" active={activeTab === 'dashboard'} onClick={() => setActiveTab('dashboard')} />
          <SidebarItem icon={Target} label="ICP & Offer" active={activeTab === 'icp'} onClick={() => setActiveTab('icp')} />
          <SidebarItem icon={Send} label="Outreach" active={activeTab === 'outreach'} onClick={() => setActiveTab('outreach')} />
          <SidebarItem icon={MessageSquare} label="Replies" active={activeTab === 'replies'} onClick={() => setActiveTab('replies')} />
          <SidebarItem icon={FileText} label="Authority" active={activeTab === 'authority'} onClick={() => setActiveTab('authority')} />
        </nav>

        <div className="absolute bottom-6 left-6 right-6">
          <Card className="bg-zinc-50 p-4">
            <div className="text-xs font-bold text-zinc-400 uppercase mb-2">Current Sprint</div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-semibold">Day 4 of 14</span>
              <span className="text-xs text-zinc-500">28%</span>
            </div>
            <div className="w-full bg-zinc-200 h-1.5 rounded-full overflow-hidden">
              <div className="bg-black h-full w-[28%]" />
            </div>
          </Card>
        </div>
      </aside>

      {/* Main Content */}
      <main className="lg:ml-64 p-8">
        <header className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-sm font-bold text-zinc-400 uppercase tracking-widest mb-1">
              {activeTab}
            </h1>
            <div className="flex items-center gap-2">
              <h2 className="text-2xl font-bold">{currentProduct?.name || 'Loading...'}</h2>
              <ChevronRight size={20} className="text-zinc-300" />
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button className="p-2 text-zinc-400 hover:text-black transition-colors">
              <BarChart3 size={20} />
            </button>
            <div className="h-8 w-8 rounded-full bg-zinc-200 border border-zinc-300" />
          </div>
        </header>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {activeTab === 'dashboard' && renderDashboard()}
            {activeTab === 'icp' && renderICP()}
            {activeTab === 'outreach' && renderOutreach()}
            {activeTab === 'replies' && (
              <div className="flex flex-col items-center justify-center py-40 text-center">
                <MessageSquare size={48} className="text-zinc-200 mb-4" />
                <h3 className="text-xl font-bold">Reply Intelligence</h3>
                <p className="text-zinc-500 max-w-sm mt-2">
                  Connect your inbox to start classifying replies and generating AI response suggestions.
                </p>
              </div>
            )}
            {activeTab === 'authority' && (
              <div className="flex flex-col items-center justify-center py-40 text-center">
                <FileText size={48} className="text-zinc-200 mb-4" />
                <h3 className="text-xl font-bold">Authority Builder</h3>
                <p className="text-zinc-500 max-w-sm mt-2">
                  Generate LinkedIn thought leadership posts and authority threads to build inbound pipeline.
                </p>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}
