import React, { useEffect, useState } from 'react';
import {
  HelpCircle,
  Search,
  BookOpen,
  CalendarCheck,
  CreditCard,
  Building,
  FileText,
  ShieldCheck,
  ThumbsUp,
  ThumbsDown,
  MessageSquarePlus,
  ChevronDown,
  ChevronUp,
  Download,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Send,
  LifeBuoy
} from 'lucide-react';
import { PageHeader } from '../../components/layout/PageHeader';
import { Card, CardBody, CardHeader } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Modal } from '../../components/feedback/Modal';
import { useToast } from '../../components/feedback/ToastContext';
import { useAuth } from '../../context/AuthContext';

export const HelpCenter = () => {
  const { user, role } = useAuth();
  const { addToast } = useToast();

  const [loading, setLoading] = useState(true);
  const [faqs, setFaqs] = useState([]);
  const [policies, setPolicies] = useState([]);
  const [tickets, setTickets] = useState([]);

  // Search & Filters
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [activeTab, setActiveTab] = useState('faqs'); // 'faqs' | 'policies' | 'requests'

  // FAQ Accordion State
  const [expandedFaqId, setExpandedFaqId] = useState(null);
  const [feedbackGiven, setFeedbackGiven] = useState({});

  // Raise Request Modal State
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
  const [requestForm, setRequestForm] = useState({
    category: 'Payroll',
    subject: '',
    details: '',
  });
  const [isSubmittingRequest, setIsSubmittingRequest] = useState(false);

  const fetchHelpCenterData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:5000/api/help-center', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setLoading(false);

      if (res.ok && data.success) {
        setFaqs(data.faqs || []);
        setPolicies(data.policies || []);
      }
    } catch (err) {
      setLoading(false);
      console.error('Error fetching help center:', err);
    }
  };

  const fetchTickets = async () => {
    if (role !== 'admin' && role !== 'hr') return;
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:5000/api/help-center/requests', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setTickets(data.tickets || []);
      }
    } catch (err) {
      console.error('Error fetching tickets:', err);
    }
  };

  useEffect(() => {
    fetchHelpCenterData();
    fetchTickets();
  }, [role]);

  const searchSuggestions = [
    'How many paid leaves do I have?',
    'How do I apply for sick leave?',
    'When will my salary be credited?',
    'How do I correct attendance?',
  ];

  const handleSuggestionClick = (query) => {
    setSearch(query);
    setActiveTab('faqs');
  };

  const handleFeedback = (faqId, type) => {
    if (feedbackGiven[faqId]) return;

    setFeedbackGiven((prev) => ({ ...prev, [faqId]: type }));
    setFaqs((prev) =>
      prev.map((f) => {
        if (f.id === faqId) {
          return {
            ...f,
            helpfulCount: type === 'up' ? f.helpfulCount + 1 : f.helpfulCount,
            unhelpfulCount: type === 'down' ? f.unhelpfulCount + 1 : f.unhelpfulCount,
          };
        }
        return f;
      })
    );

    addToast({
      title: 'Feedback Recorded',
      message: 'Thank you for helping us improve our HR Knowledge Base!',
      type: 'success',
    });
  };

  const handleCreateRequestSubmit = async (e) => {
    e.preventDefault();
    if (!requestForm.subject || !requestForm.details) {
      addToast({ title: 'Validation Error', message: 'Subject and question details are required.', type: 'error' });
      return;
    }

    setIsSubmittingRequest(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:5000/api/help-center/request', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(requestForm),
      });

      const data = await res.json();
      setIsSubmittingRequest(false);

      if (res.ok && data.success) {
        addToast({
          title: 'HR Request Submitted',
          message: `Request ${data.ticket?.id || 'TICK-802'} sent to HR team. An HR representative will reach out to you soon.`,
          type: 'success',
        });
        setIsRequestModalOpen(false);
        setRequestForm({ category: 'Payroll', subject: '', details: '' });
        fetchTickets();
      } else {
        throw new Error(data.message || 'Failed to submit request.');
      }
    } catch (err) {
      setIsSubmittingRequest(false);
      addToast({ title: 'Submission Error', message: err.message || 'Could not submit request.', type: 'error' });
    }
  };

  const categories = [
    { name: 'all', label: 'All Topics', icon: BookOpen },
    { name: 'Leave', label: 'Leave & Time-off', icon: CalendarCheck },
    { name: 'Attendance', label: 'Shift & Attendance', icon: ShieldCheck },
    { name: 'Payroll', label: 'Payroll & Compensation', icon: CreditCard },
    { name: 'Benefits', label: 'Benefits & Insurance', icon: HeartIcon },
    { name: 'Company Policies', label: 'Company Policies', icon: Building },
    { name: 'Documents', label: 'Compliance & Documents', icon: FileText },
  ];

  const filteredFaqs = faqs.filter((faq) => {
    const matchesSearch =
      faq.question.toLowerCase().includes(search.toLowerCase()) ||
      faq.answer.toLowerCase().includes(search.toLowerCase()) ||
      (faq.tags && faq.tags.some((t) => t.toLowerCase().includes(search.toLowerCase())));

    const matchesCategory = activeCategory === 'all' || faq.category.toLowerCase() === activeCategory.toLowerCase();
    return matchesSearch && matchesCategory;
  });

  const filteredPolicies = policies.filter((pol) => {
    const matchesSearch =
      pol.title.toLowerCase().includes(search.toLowerCase()) ||
      pol.summary.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = activeCategory === 'all' || pol.category.toLowerCase() === activeCategory.toLowerCase();
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6 pb-8">
      {/* PAGE HEADER */}
      <PageHeader
        title="DayFlow HR Help Center"
        subtitle="Search organizational policies, leave rules, payroll schedules, and compliance guidelines directly from our verified knowledge base."
        breadcrumbs={['DayFlow', 'Knowledge Base', 'HR Help Center']}
        action={
          <Button
            variant="primary"
            size="sm"
            leftIcon={<MessageSquarePlus size={16} />}
            onClick={() => setIsRequestModalOpen(true)}
            className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold"
          >
            Raise HR Request
          </Button>
        }
      />

      {/* SEARCH BANNER */}
      <Card className="bg-white border border-slate-200 shadow-sm">
        <CardBody className="p-6 space-y-4">
          <div className="max-w-2xl mx-auto text-center space-y-2">
            <h2 className="text-xl font-black text-slate-900 flex items-center justify-center gap-2">
              <LifeBuoy size={24} className="text-indigo-600" />
              How can HR help you today?
            </h2>
            <p className="text-xs text-slate-600 font-medium">
              Search predefined answers from DayFlow's official HR knowledge base.
            </p>

            {/* Search Input Box */}
            <div className="relative pt-2">
              <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search HR policies, e.g. 'How many paid leaves do I have?'"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 shadow-inner font-semibold"
              />
            </div>

            {/* Search Suggestions Pills */}
            <div className="pt-2 flex flex-wrap items-center justify-center gap-2">
              <span className="text-[11px] font-black text-slate-900 uppercase tracking-wider mr-1">Frequent Searches:</span>
              {searchSuggestions.map((sug, i) => (
                <button
                  key={i}
                  onClick={() => handleSuggestionClick(sug)}
                  className="text-xs font-bold bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 px-3 py-1 rounded-full transition-all cursor-pointer"
                >
                  "{sug}"
                </button>
              ))}
            </div>
          </div>
        </CardBody>
      </Card>

      {/* CATEGORY GRID SHORTCUTS */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
        {categories.map((cat) => {
          const Icon = cat.icon;
          const isActive = activeCategory === cat.name;
          return (
            <button
              key={cat.name}
              onClick={() => setActiveCategory(cat.name)}
              className={`p-3 rounded-xl border transition-all text-left flex flex-col justify-between gap-2 cursor-pointer ${
                isActive
                  ? 'bg-indigo-600 border-indigo-600 text-white shadow-md'
                  : 'bg-white border-slate-200 text-slate-900 hover:bg-slate-50 shadow-sm'
              }`}
            >
              <Icon size={18} className={isActive ? 'text-white' : 'text-indigo-600'} />
              <span className="text-xs font-black leading-tight">{cat.label}</span>
            </button>
          );
        })}
      </div>

      {/* NAVIGATION TABS (FAQs vs Policy Documents vs Admin HR Tickets) */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-3">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('faqs')}
            className={`px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer ${
              activeTab === 'faqs' ? 'bg-indigo-600 text-white shadow-md' : 'bg-white text-slate-900 border border-slate-200 hover:bg-slate-50 shadow-sm'
            }`}
          >
            Frequently Asked Questions ({filteredFaqs.length})
          </button>
          <button
            onClick={() => setActiveTab('policies')}
            className={`px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer ${
              activeTab === 'policies' ? 'bg-indigo-600 text-white shadow-md' : 'bg-white text-slate-900 border border-slate-200 hover:bg-slate-50 shadow-sm'
            }`}
          >
            HR Policy Documents ({filteredPolicies.length})
          </button>
          {(role === 'admin' || role === 'hr') && (
            <button
              onClick={() => setActiveTab('requests')}
              className={`px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer ${
                activeTab === 'requests' ? 'bg-indigo-600 text-white shadow-md' : 'bg-white text-slate-900 border border-slate-200 hover:bg-slate-50 shadow-sm'
              }`}
            >
              Submitted HR Requests ({tickets.length})
            </button>
          )}
        </div>

        <span className="text-xs font-semibold text-slate-600">
          Knowledge Base Version: <strong className="text-slate-900 font-mono font-black">2026.2</strong>
        </span>
      </div>

      {/* TAB CONTENT: FAQS */}
      {activeTab === 'faqs' && (
        <div className="space-y-4">
          {loading ? (
            <div className="py-16 text-center text-slate-700">
              <RefreshCw size={32} className="animate-spin mx-auto text-indigo-600 mb-3" />
              <p className="text-xs font-bold">Searching HR knowledge base...</p>
            </div>
          ) : filteredFaqs.length === 0 ? (
            <Card className="bg-white border border-slate-200 py-12 text-center shadow-sm">
              <CardBody className="space-y-3">
                <HelpCircle size={40} className="text-slate-400 mx-auto" />
                <h3 className="text-sm font-black text-slate-900">No Matching Answers Found</h3>
                <p className="text-xs text-slate-600 max-w-sm mx-auto font-medium">
                  We couldn't find a predefined answer for your search. Click below to submit an inquiry to HR.
                </p>
                <Button
                  variant="primary"
                  size="sm"
                  leftIcon={<MessageSquarePlus size={15} />}
                  onClick={() => setIsRequestModalOpen(true)}
                  className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold"
                >
                  Raise HR Request
                </Button>
              </CardBody>
            </Card>
          ) : (
            filteredFaqs.map((faq) => {
              const isExpanded = expandedFaqId === faq.id || search.length > 3;
              const feedback = feedbackGiven[faq.id];

              return (
                <Card
                  key={faq.id}
                  className="bg-white border border-slate-200 hover:border-slate-300 transition-all shadow-sm"
                >
                  <CardBody className="p-4 space-y-3">
                    <button
                      onClick={() => setExpandedFaqId(isExpanded ? null : faq.id)}
                      className="w-full flex items-start justify-between text-left gap-3 cursor-pointer"
                    >
                      <div className="space-y-1">
                        <span className="text-[10px] font-mono font-black text-indigo-700 uppercase tracking-wider bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">
                          {faq.category}
                        </span>
                        <h3 className="text-sm font-black text-slate-900 hover:text-indigo-600 transition-colors pt-1">
                          {faq.question}
                        </h3>
                      </div>
                      <div className="p-1 rounded-lg bg-slate-100 text-slate-700 flex-shrink-0 mt-1">
                        {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                      </div>
                    </button>

                    {isExpanded && (
                      <div className="pt-2 border-t border-slate-100 space-y-3">
                        <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 font-semibold leading-relaxed">
                          {faq.answer}
                        </div>

                        {/* Was this helpful feedback bar */}
                        <div className="flex items-center justify-between text-xs pt-1">
                          <span className="text-slate-700 font-bold">Was this answer helpful?</span>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleFeedback(faq.id, 'up')}
                              disabled={!!feedback}
                              className={`px-3 py-1 rounded-lg border text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                                feedback === 'up'
                                  ? 'bg-emerald-600 text-white border-emerald-600'
                                  : 'bg-slate-100 hover:bg-slate-200 text-slate-900 border-slate-200'
                              }`}
                            >
                              <ThumbsUp size={13} /> Yes ({faq.helpfulCount})
                            </button>
                            <button
                              onClick={() => handleFeedback(faq.id, 'down')}
                              disabled={!!feedback}
                              className={`px-3 py-1 rounded-lg border text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                                feedback === 'down'
                                  ? 'bg-rose-600 text-white border-rose-600'
                                  : 'bg-slate-100 hover:bg-slate-200 text-slate-900 border-slate-200'
                              }`}
                            >
                              <ThumbsDown size={13} /> No ({faq.unhelpfulCount})
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </CardBody>
                </Card>
              );
            })
          )}
        </div>
      )}

      {/* TAB CONTENT: POLICY DOCUMENTS */}
      {activeTab === 'policies' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {filteredPolicies.map((pol) => (
            <Card key={pol.id} className="bg-white border border-slate-200 flex flex-col justify-between shadow-sm">
              <CardBody className="p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <Badge variant="info" className="text-[10px] font-mono font-bold">
                    {pol.category}
                  </Badge>
                  <span className="text-[10px] text-slate-500 font-mono font-bold">Updated: {pol.lastUpdated}</span>
                </div>
                <div>
                  <h3 className="font-black text-sm text-slate-900 mb-1">{pol.title}</h3>
                  <p className="text-xs text-slate-600 font-medium leading-relaxed">{pol.summary}</p>
                </div>
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-slate-600 font-mono font-semibold">{pol.fileSize}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    leftIcon={<Download size={14} />}
                    onClick={() =>
                      addToast({
                        title: 'Downloading Policy Document',
                        message: `Downloading ${pol.title}...`,
                        type: 'info',
                      })
                    }
                    className="text-xs font-bold text-indigo-700"
                  >
                    Download PDF
                  </Button>
                </div>
              </CardBody>
            </Card>
          ))}
        </div>
      )}

      {/* TAB CONTENT: SUBMITTED HR REQUESTS (ADMIN & HR) */}
      {activeTab === 'requests' && (
        <Card className="bg-white border border-slate-200 shadow-sm">
          <CardHeader title="Employee Support Request Tickets" subtitle="Inquiries submitted when knowledge base answers were insufficient" />
          <CardBody className="p-4">
            <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50 text-slate-900 border-b border-slate-200 uppercase tracking-wider font-black text-[11px]">
                    <th className="py-3.5 px-4">Ticket ID</th>
                    <th className="py-3.5 px-4">Employee</th>
                    <th className="py-3.5 px-4">Category</th>
                    <th className="py-3.5 px-4">Subject</th>
                    <th className="py-3.5 px-4">Date</th>
                    <th className="py-3.5 px-4 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-semibold">
                  {tickets.map((t) => (
                    <tr key={t.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3.5 px-4 font-mono font-bold text-indigo-700">{t.id}</td>
                      <td className="py-3.5 px-4 text-slate-900 font-extrabold">{t.employeeName}</td>
                      <td className="py-3.5 px-4 text-slate-700 font-bold">{t.category}</td>
                      <td className="py-3.5 px-4 text-slate-900 font-semibold">{t.subject}</td>
                      <td className="py-3.5 px-4 text-slate-600 font-mono">{t.createdAt}</td>
                      <td className="py-3.5 px-4 text-right">
                        <Badge variant={t.status === 'Open' ? 'warning' : 'success'} className="text-[10px] font-bold">
                          {t.status}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardBody>
        </Card>
      )}

      {/* RAISE HR SUPPORT REQUEST MODAL */}
      <Modal
        isOpen={isRequestModalOpen}
        onClose={() => setIsRequestModalOpen(false)}
        title="Raise an HR Inquiry / Support Ticket"
        subtitle="Can't find what you need in the Knowledge Base? Submit your request directly to HR."
        size="md"
      >
        <form onSubmit={handleCreateRequestSubmit} className="space-y-4 pt-1">
          <div>
            <label className="block text-xs font-black text-slate-900 mb-1">Inquiry Category</label>
            <select
              value={requestForm.category}
              onChange={(e) => setRequestForm({ ...requestForm, category: e.target.value })}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 cursor-pointer font-bold"
            >
              <option value="Payroll">Payroll & Salary Structure</option>
              <option value="Leave">Leave Quotas & Approval</option>
              <option value="Attendance">Attendance Regularization</option>
              <option value="Benefits">Health Insurance & Benefits</option>
              <option value="Documents">Tax Documents & Form 16</option>
              <option value="Company Policies">Company Policies & Compliance</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-black text-slate-900 mb-1">Subject / Question Summary</label>
            <input
              type="text"
              placeholder="e.g. Discrepancy in August HRA calculation"
              value={requestForm.subject}
              onChange={(e) => setRequestForm({ ...requestForm, subject: e.target.value })}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 font-medium"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-black text-slate-900 mb-1">Detailed Explanation</label>
            <textarea
              rows={4}
              placeholder="Provide specific details, dates, or context so HR can assist you quickly..."
              value={requestForm.details}
              onChange={(e) => setRequestForm({ ...requestForm, details: e.target.value })}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 font-medium"
              required
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200">
            <Button variant="ghost" type="button" onClick={() => setIsRequestModalOpen(false)} size="sm">
              Cancel
            </Button>
            <Button
              variant="primary"
              type="submit"
              size="sm"
              isLoading={isSubmittingRequest}
              leftIcon={<Send size={15} />}
              className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold"
            >
              Submit Ticket to HR
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

// Helper icon component
const HeartIcon = ({ size, className }) => (
  <ShieldCheck size={size} className={className} />
);
