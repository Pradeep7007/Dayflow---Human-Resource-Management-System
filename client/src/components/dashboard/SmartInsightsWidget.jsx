import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, ArrowRight, Zap, AlertTriangle, TrendingUp } from 'lucide-react';
import { Card, CardBody, CardHeader } from '../ui/Card';
import { Button } from '../ui/Button';

export const SmartInsightsWidget = () => {
  const navigate = useNavigate();
  const [insights, setInsights] = useState([]);

  useEffect(() => {
    const fetchWidgetData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;
        const res = await fetch('http://localhost:5000/api/dashboard/insights', {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = await res.json();
        if (data.success && data.insights) {
          setInsights(data.insights.slice(0, 3));
        }
      } catch (err) {
        console.error('Error fetching smart insights widget:', err);
      }
    };

    fetchWidgetData();
  }, []);

  if (insights.length === 0) return null;

  return (
    <Card className="bg-white border border-slate-200 shadow-sm">
      <CardHeader
        title={
          <div className="flex items-center gap-2 text-slate-900 font-extrabold text-sm">
            <Sparkles size={16} className="text-cyan-600" />
            DayFlow Smart Insights
          </div>
        }
        subtitle="Data-driven workforce observations & automated alerts"
        action={
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/admin/insights')}
            className="text-xs text-indigo-600 hover:text-indigo-800 font-bold"
            rightIcon={<ArrowRight size={14} />}
          >
            View All ({insights.length}+)
          </Button>
        }
      />
      <CardBody className="p-4 space-y-3">
        {insights.map((ins) => (
          <div
            key={ins.id}
            className="p-3 rounded-xl bg-slate-50 border border-slate-200 hover:border-slate-300 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs"
          >
            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <span className="font-mono font-black text-[10px] text-cyan-800 uppercase">{ins.category}</span>
                <span className="font-extrabold text-slate-900 text-xs">{ins.title}</span>
              </div>
              <p className="text-slate-700 font-semibold text-[11px]">{ins.observation}</p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate(ins.actionRoute)}
              className="bg-indigo-50 text-indigo-700 border border-indigo-200 hover:bg-indigo-100 text-xs font-bold py-1 px-3 self-end sm:self-center"
            >
              {ins.actionText}
            </Button>
          </div>
        ))}
      </CardBody>
    </Card>
  );
};
