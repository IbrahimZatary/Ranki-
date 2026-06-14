import { useState, useEffect } from 'react';
import axiosClient from '../api/axiosClient';
import { motion } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer } from 'recharts';
import { Download, ChevronDown, CheckCircle2, Copy, MessageCircle, AlertCircle, ArrowUp, ArrowDown, Activity } from 'lucide-react';

const chartData = [
  { name: 'Week 1', you: 30, avg: 45 },
  { name: 'Week 2', you: 33, avg: 46 },
  { name: 'Week 3', you: 35, avg: 46 },
  { name: 'Week 4', you: 40, avg: 47 },
  { name: 'Week 5', you: 45, avg: 47 },
  { name: 'Week 6', you: 45, avg: 48 },
];

export default function Dashboard() {
  const navigate = useNavigate();
  const [dateRange, setDateRange] = useState('Last 30 days');
  const [profile, setProfile] = useState(null);
  const [dashboardData, setDashboardData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [profileRes, summaryRes] = await Promise.all([
          axiosClient.get('/business-profile'),
          axiosClient.get('/Dashboard/summary')
        ]);
        setProfile(profileRes.data);
        setDashboardData(summaryRes.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  const handleDownload = (filename, content) => {
    const element = document.createElement("a");
    const file = new Blob([content], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = filename;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const getFileContent = (type) => {
    if (!dashboardData?.competitors) return '';
    const file = dashboardData.generatedFiles?.find(f => f.fileType === type);
    return file ? file.content : `No ${type} generated yet.`;
  };

  if (!dashboardData) {
    return <div className="min-h-screen bg-background flex items-center justify-center">Loading...</div>;
  }

  const visibilityScore = dashboardData.latestVisibilityScore;

  return (
    <div className="min-h-screen bg-background font-body pb-20">
      {/* Section A: Header */}
      <nav className="p-6 border-b border-border bg-white flex justify-between items-center sticky top-0 z-50">
        <Link to="/dashboard" className="text-2xl font-bold font-heading">Ranki</Link>
        <div className="flex items-center space-x-6">
          <select 
            value={dateRange} 
            onChange={(e) => setDateRange(e.target.value)}
            className="input-field py-2 text-sm bg-gray-50 border-gray-200"
          >
            <option>Last 7 days</option>
            <option>Last 30 days</option>
            <option>This month</option>
          </select>
          <button 
            onClick={() => handleDownload('Ranki_Summary.txt', `Ranki Summary Report: Visibility is ${visibilityScore}%`)}
            className="btn-secondary py-2 flex items-center text-sm"
          >
            <Download className="w-4 h-4 mr-2" /> Download Report
          </button>
          <div className="relative group cursor-pointer flex items-center space-x-2">
            <div className="w-10 h-10 rounded-full bg-accent text-white flex items-center justify-center font-bold">U</div>
            <ChevronDown className="w-4 h-4 text-textSecondary" />
            <div className="absolute right-0 top-12 w-48 bg-white border border-border rounded-xl shadow-lg hidden group-hover:block overflow-hidden">
              <button onClick={() => navigate('/settings')} className="w-full text-left px-4 py-3 hover:bg-gray-50">Settings</button>
              <button onClick={() => navigate('/reports')} className="w-full text-left px-4 py-3 hover:bg-gray-50">Past Reports</button>
              <button onClick={handleLogout} className="w-full text-left px-4 py-3 hover:bg-gray-50 text-red-600">Logout</button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto mt-10 px-6 space-y-12">
        {/* Top Info Banner */}
        {profile && (
          <div className="card bg-accent/10 border border-accent/20 flex flex-col md:flex-row justify-between items-start md:items-center">
            <div>
              <h2 className="text-3xl font-heading text-textPrimary">{profile.businessName}</h2>
              <p className="text-textSecondary">{profile.websiteUrl} • {profile.industry}</p>
            </div>
            <button onClick={() => navigate('/scan')} className="btn-primary mt-4 md:mt-0 flex items-center">
              <Activity className="w-4 h-4 mr-2" /> Run New Scan
            </button>
          </div>
        )}

        {/* Section B: Hero Score */}
        <section className="card flex flex-col md:flex-row items-center justify-between">
          <div className="w-full md:w-1/3 flex flex-col items-center justify-center p-6 border-b md:border-b-0 md:border-r border-border">
            <h3 className="text-xl font-heading mb-6 text-textPrimary">AI Visibility Score</h3>
            <div className="w-48 h-48">
              <CircularProgressbar 
                value={visibilityScore} 
                text={`${visibilityScore}%`} 
                styles={buildStyles({
                  pathColor: '#c8b2ff',
                  textColor: '#111111',
                  trailColor: '#f3f4f6',
                  textSize: '24px',
                })} 
              />
            </div>
            <p className="text-textSecondary mt-4 text-center">Your brand appears in {visibilityScore}% of relevant AI queries.</p>
          </div>

          <div className="w-full md:w-2/3 p-6 pl-0 md:pl-10">
            <div className="flex justify-between items-end mb-6">
              <h3 className="text-2xl font-heading">Competitor Ranking</h3>
              <span className="text-sm text-textSecondary font-medium">Top 5 Discovered</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-gray-50 text-textSecondary text-xs uppercase tracking-wider font-semibold">
                  <tr>
                    <th className="p-4 rounded-tl-xl">Rank</th>
                    <th className="p-4">Brand</th>
                    <th className="p-4 rounded-tr-xl">URL</th>
                  </tr>
                </thead>
                <tbody>
                  {dashboardData.competitors && dashboardData.competitors.length > 0 ? dashboardData.competitors.map((comp, index) => (
                    <tr key={index} className="border-b border-gray-100 last:border-0 hover:bg-gray-50 transition-colors">
                      <td className="p-4 font-bold text-lg">#{index + 1}</td>
                      <td className="p-4 font-medium flex items-center">
                        {comp.name}
                      </td>
                      <td className="p-4 font-medium text-sm text-gray-500">{comp.websiteUrl || 'N/A'}</td>
                    </tr>
                  )) : (
                    <tr><td colSpan="3" className="p-4 text-center text-gray-500">No competitors discovered yet.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* Section C: Why Competitors Are Ahead */}
        <section>
          <h3 className="text-2xl font-heading mb-6 text-textPrimary">AI Generated Insights</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {dashboardData.recommendations && dashboardData.recommendations.slice(0, 3).map((rec, index) => (
              <div key={index} className="card bg-gray-50/50">
                <AlertCircle className="w-8 h-8 text-orange-500 mb-4" />
                <p className="font-medium text-sm mb-2">{rec.category}</p>
                <p className="text-gray-600 text-xs">{rec.recommendationText}</p>
              </div>
            ))}
            {(!dashboardData.recommendations || dashboardData.recommendations.length === 0) && (
              <p className="text-gray-500">No insights available.</p>
            )}
          </div>
        </section>

        {/* Section E: Recommendations */}
        <section>
          <h2 className="text-2xl font-heading mb-6">Actionable Recommendations</h2>
          <div className="card p-0 overflow-hidden divide-y divide-border">
            {dashboardData.recommendations && dashboardData.recommendations.map((rec, index) => (
              <div key={index} className="p-6 flex items-start space-x-4 hover:bg-gray-50 transition-colors">
                <input type="checkbox" className="mt-1 w-5 h-5 accent-accent cursor-pointer" defaultChecked={rec.isCompleted} />
                <div className="flex-grow">
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-lg font-medium">{rec.recommendationText}</p>
                    <span className="flex items-center text-xs font-bold uppercase tracking-wider text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                      <span className={`w-2 h-2 rounded-full mr-2 ${rec.priority === 1 ? 'bg-red-500' : 'bg-orange-500'}`}></span>
                      {rec.priority === 1 ? 'High' : 'Normal'}
                    </span>
                  </div>
                  <p className="text-green-600 font-medium text-sm flex items-center">
                    <ArrowUp className="w-4 h-4 mr-1" /> Expected Visibility Boost
                  </p>
                </div>
              </div>
            ))}
            {(!dashboardData.recommendations || dashboardData.recommendations.length === 0) && (
              <div className="p-6 text-center text-gray-500">No recommendations available.</div>
            )}
          </div>
        </section>

        {/* Section F: Download Ready Files */}
        <section>
          <h2 className="text-2xl font-heading mb-6">Ready to Use Files</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="card border-accent border-2">
              <h3 className="font-bold mb-4 font-heading text-lg">robots.txt config</h3>
              <div className="bg-gray-900 text-green-400 p-4 rounded-md text-sm font-mono mb-4 overflow-hidden h-24">
                User-agent: ChatGPT-User<br/>
                Allow: /<br/>
                Sitemap: https://...
              </div>
              <div className="flex space-x-2">
                <button 
                  onClick={() => handleDownload('robots.txt', getFileContent('robots.txt'))}
                  className="flex-1 btn-secondary py-2 flex justify-center items-center text-sm"
                >
                  <Copy className="w-4 h-4 mr-2"/> Copy
                </button>
                <button 
                  onClick={() => handleDownload('robots.txt', getFileContent('robots.txt'))}
                  className="flex-1 btn-primary py-2 flex justify-center items-center text-sm"
                >
                  <Download className="w-4 h-4 mr-2"/> Get
                </button>
              </div>
            </div>
            <div className="card">
              <h3 className="font-bold mb-4 font-heading text-lg">llms.txt</h3>
              <div className="bg-gray-100 p-4 rounded-md text-sm text-gray-600 mb-4 h-24 flex items-center justify-center">
                Optimized AI text summary ready for download
              </div>
              <button 
                onClick={() => handleDownload('llms.txt', getFileContent('llms.txt'))}
                className="w-full btn-secondary py-2 flex justify-center items-center"
              >
                <Download className="w-4 h-4 mr-2"/> Download
              </button>
            </div>
            <div className="card bg-gray-900 text-white border-0 flex flex-col justify-center items-center text-center">
              <h3 className="font-bold mb-2 font-heading text-2xl text-white">Full Report</h3>
              <p className="text-gray-400 mb-6 text-sm">Download the comprehensive PDF report with all insights.</p>
              <button 
                onClick={() => handleDownload('Ranki_Full_Report.txt', getFileContent('full_report.txt') !== 'No full_report.txt generated yet.' ? getFileContent('full_report.txt') : `RANKI FULL AI VISIBILITY REPORT\n\nScore: ${visibilityScore}%\n\nRecommendations:\n${dashboardData.recommendations?.map(r => r.recommendationText).join('\n')}`)}
                className="w-full bg-white text-black font-bold py-3 rounded-btn hover:bg-gray-200 transition-colors flex justify-center items-center"
              >
                <Download className="w-4 h-4 mr-2"/> Export Report
              </button>
            </div>
          </div>
        </section>

        {/* Section G: Expected ROI */}
        <section className="bg-accent/10 rounded-2xl p-8 border border-accent/20">
          <h2 className="text-2xl font-heading mb-6">Expected ROI</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <p className="text-textSecondary text-sm font-bold uppercase tracking-wider mb-2">Visibility Jump</p>
              <p className="text-2xl font-heading">45% → 65-75%</p>
              <p className="text-sm text-textSecondary mt-1">Expected after 30 days</p>
            </div>
            <div>
              <p className="text-textSecondary text-sm font-bold uppercase tracking-wider mb-2">Customer Impact</p>
              <p className="text-2xl font-heading text-green-600">+3 to +5</p>
              <p className="text-sm text-textSecondary mt-1">Estimated new customers/mo</p>
            </div>
            <div>
              <p className="text-textSecondary text-sm font-bold uppercase tracking-wider mb-2">Value</p>
              <p className="text-2xl font-heading">300-500 JOD</p>
              <p className="text-sm text-textSecondary mt-1">From a 79 JOD subscription</p>
            </div>
          </div>
        </section>

        {/* Section H: Weekly Trend Chart */}
        <section className="card">
          <h2 className="text-2xl font-heading mb-6">Weekly Trend</h2>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#6b7280'}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#6b7280'}} domain={[0, 100]} />
                <RechartsTooltip 
                  contentStyle={{borderRadius: '8px', border: '1px solid #111111', boxShadow: '0 4px 14px 0 rgba(0,0,0,0.1)'}}
                />
                <Legend />
                <Line type="monotone" name="Your Company" dataKey="you" stroke="#c8b2ff" strokeWidth={3} dot={{r: 4, strokeWidth: 2}} activeDot={{r: 6}} />
                <Line type="monotone" name="Industry Average" dataKey="avg" stroke="#9ca3af" strokeWidth={2} strokeDasharray="5 5" dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </section>
      </main>

      {/* Section I: Footer Note */}
      <div className="max-w-6xl mx-auto mt-20 px-6 text-center">
        <a href="https://wa.me/123456789" className="inline-flex items-center text-textSecondary hover:text-accent transition-colors font-medium">
          <MessageCircle className="w-5 h-5 mr-2" />
          Questions? Contact us on WhatsApp
        </a>
      </div>
    </div>
  );
}
