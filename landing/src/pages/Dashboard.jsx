import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useNavigate } from 'react-router-dom';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Cell
} from 'recharts';
import { 
  TrendingUp, Activity, AlertCircle, Clock, 
  Wind, Brain, ShieldAlert, LogOut
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [logs, setLogs] = useState([]);
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    score: 0,
    events: 0,
    hours: 0,
    lung: 0
  });

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate('/login');
      } else {
        setUser(user);
        fetchLogs(user.id);
      }
      setLoading(false);
    };

    checkUser();
  }, [navigate]);

  const fetchLogs = async (userId) => {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const { data, error } = await supabase
      .from('posture_logs')
      .select('*')
      .eq('user_id', userId)
      .gte('timestamp', thirtyDaysAgo.toISOString())
      .order('timestamp', { ascending: true });

    if (!error && data) {
      setLogs(data);
      calculateStats(data);
    }
  };

  const calculateStats = (data) => {
    if (data.length === 0) return;

    const avgScore = data.reduce((acc, log) => acc + (log.posture_score || 0), 0) / data.length;
    const slouchCount = data.filter(log => log.is_slouching).length;
    const totalHours = (data.length * 30) / 3600;
    const lungImprovement = (avgScore / 100) * 15;

    setStats({
      score: Math.round(avgScore),
      events: slouchCount,
      hours: totalHours.toFixed(1),
      lung: lungImprovement.toFixed(1)
    });
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent-blue"></div>
    </div>
  );

  const getChartData = () => {
    if (logs.length === 0) return [{ timestamp: 'N/A', posture_score: 0 }];
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const grouped = logs.reduce((acc, log) => {
      const date = new Date(log.timestamp);
      const day = days[date.getDay()];
      if (!acc[day]) acc[day] = { count: 0, sum: 0 };
      acc[day].count++;
      acc[day].sum += log.posture_score;
      return acc;
    }, {});
    return days.map(day => ({
      timestamp: day,
      posture_score: grouped[day] ? Math.round(grouped[day].sum / grouped[day].count) : 0
    }));
  };

  const getFrequencyData = () => {
    const timeLabels = ['9AM', '11AM', '1PM', '3PM', '5PM', '7PM'];
    const grouped = logs.reduce((acc, log) => {
      const date = new Date(log.timestamp);
      let hr = date.getHours();
      let label = hr >= 12 ? (hr === 12 ? '12PM' : (hr-12) + 'PM') : (hr === 0 ? '12AM' : hr + 'AM');
      if (!acc[label]) acc[label] = 0;
      if (log.is_slouching) acc[label]++;
      return acc;
    }, {});
    return timeLabels.map(h => ({ hour: h, count: grouped[h] || 0 }));
  };

  const COLORS = ['#5C7CFA', '#748ffc', '#91a7ff', '#bac8ff', '#dbe4ff'];

  return (
    <div className="min-h-screen pb-12 pt-24">
      <main className="max-w-7xl mx-auto px-4 mt-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          <StatCard icon={<TrendingUp className="text-accent-blue"/>} label="Posture Score" value={`${stats.score}%`} trend="+4% vs last week" />
          <StatCard icon={<AlertCircle className="text-alert-red"/>} label="Slouch Events" value={stats.events.toString()} trend="-2 vs yesterday" />
          <StatCard icon={<Clock className="text-accent-blue"/>} label="Hours Monitored" value={`${stats.hours}h`} trend="This Month" />
          <StatCard icon={<Wind className="text-accent-blue"/>} label="Lung Capacity" value={`+${stats.lung}%`} trend="Estimated improvement" />
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-2 glass-card p-8 bg-white/60"
          >
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-xl font-serif font-bold text-navy">Weekly Posture Trend</h3>
              <select className="bg-white/50 border border-white/60 rounded-xl text-xs font-bold px-4 py-2 focus:outline-none uppercase tracking-widest text-navy/60">
                <option>Last 7 Days</option>
                <option>Last 30 Days</option>
              </select>
            </div>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={getChartData()}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(28, 36, 75, 0.05)" />
                  <XAxis dataKey="timestamp" axisLine={false} tickLine={false} tick={{fill: '#1C244B', fontSize: 10, fontWeight: 600}} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#1C244B', fontSize: 10, fontWeight: 600}} dx={-10} domain={[0, 100]} />
                  <Tooltip 
                    contentStyle={{ borderRadius: '24px', border: 'none', background: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(10px)', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="posture_score" 
                    stroke="#5C7CFA" 
                    strokeWidth={4} 
                    dot={{ r: 6, fill: '#5C7CFA', strokeWidth: 3, stroke: '#fff' }}
                    activeDot={{ r: 8, strokeWidth: 0 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="glass-card p-8 bg-white/60"
          >
            <h3 className="text-xl font-serif font-bold text-navy mb-8">Slouch Frequency</h3>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={getFrequencyData()}>
                  <XAxis dataKey="hour" axisLine={false} tickLine={false} tick={{fill: '#1C244B', fontSize: 10, fontWeight: 600}} dy={10} />
                  <Tooltip cursor={{fill: 'rgba(92, 124, 250, 0.05)'}} contentStyle={{ borderRadius: '24px', border: 'none' }} />
                  <Bar dataKey="count" radius={[8, 8, 8, 8]} barSize={32}>
                    {getFrequencyData().map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <InsightCard 
            icon={<Wind className="w-5 h-5 text-accent-blue" />}
            title="Respiratory Health"
            text="Prolonged slouching can decrease lung capacity by up to 30%. Your current streak is helping you breathe deeper."
          />
          <InsightCard 
            icon={<Brain className="w-5 h-5 text-accent-blue" />}
            title="Cognitive Performance"
            text="Correcting your posture helps reduce 'Brain Fog' and improves oxygen flow to the prefrontal cortex."
          />
          <InsightCard 
            icon={<ShieldAlert className="w-5 h-5 text-alert-red" />}
            title="Musculoskeletal Risk"
            text="Frequent 30-day slouching patterns are linked to permanent spinal curvature changes. Stay vigilant!"
          />
        </div>
      </main>
    </div>
  );
}

function StatCard({ icon, label, value, trend }) {
  return (
    <div className="glass-card p-8 bg-white/60 hover:shadow-lg transition-all duration-300 group">
      <div className="flex items-center space-x-4 mb-6">
        <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">{icon}</div>
        <span className="text-xs font-bold text-navy/40 uppercase tracking-widest">{label}</span>
      </div>
      <div className="flex items-baseline justify-between">
        <span className="text-3xl font-serif font-bold text-navy">{value}</span>
        <span className="text-[10px] font-bold text-accent-blue uppercase tracking-wider bg-accent-blue/5 px-2 py-1 rounded-full">{trend}</span>
      </div>
    </div>
  );
}

function InsightCard({ icon, title, text }) {
  return (
    <div className="glass-card p-6 border-none bg-white/60">
      <div className="flex items-center space-x-3 mb-4">
        <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm">{icon}</div>
        <h4 className="font-serif font-bold text-navy">{title}</h4>
      </div>
      <p className="text-sm text-navy/60 font-medium leading-relaxed">{text}</p>
    </div>
  );
}
