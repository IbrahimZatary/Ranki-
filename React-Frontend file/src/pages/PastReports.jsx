import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Download, Eye, ChevronDown } from 'lucide-react';

export default function PastReports() {
  const navigate = useNavigate();
  // Set to empty array to test empty state, or add items to test filled state
  const [reports, setReports] = useState([
    { id: 1, date: 'June 9, 2026', score: 45 },
    { id: 2, date: 'June 2, 2026', score: 33 },
    { id: 3, date: 'May 26, 2026', score: 30 }
  ]);

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

  return (
    <div className="min-h-screen bg-background font-body pb-20">
      <nav className="p-6 border-b border-border bg-white flex justify-between items-center sticky top-0 z-50">
        <Link to="/dashboard" className="text-2xl font-bold font-heading">Ranki</Link>
        <div className="flex items-center space-x-6">
          <div className="relative group cursor-pointer flex items-center space-x-2">
            <div className="w-10 h-10 rounded-full bg-accent text-white flex items-center justify-center font-bold">U</div>
            <ChevronDown className="w-4 h-4 text-textSecondary" />
            <div className="absolute right-0 top-12 w-48 bg-white border border-border rounded-xl shadow-lg hidden group-hover:block overflow-hidden">
              <button onClick={() => navigate('/dashboard')} className="w-full text-left px-4 py-3 hover:bg-gray-50">Dashboard</button>
              <button onClick={() => navigate('/settings')} className="w-full text-left px-4 py-3 hover:bg-gray-50">Settings</button>
              <button onClick={handleLogout} className="w-full text-left px-4 py-3 hover:bg-gray-50 text-red-600">Logout</button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto mt-10 px-6">
        <h2 className="text-4xl font-heading mb-8 text-textPrimary">Past Reports</h2>

        {reports.length === 0 ? (
          <div className="card text-center py-20 bg-white">
            <p className="text-xl text-textSecondary mb-4">No past reports yet.</p>
            <p className="text-textSecondary mb-8">Your first report will appear after your first scan.</p>
            <button onClick={() => navigate('/onboarding')} className="btn-primary">Start First Scan</button>
          </div>
        ) : (
          <div className="card p-0 overflow-hidden bg-white">
            <table className="w-full text-left">
              <thead className="bg-gray-50 border-b border-border">
                <tr>
                  <th className="p-4 font-semibold text-textSecondary uppercase tracking-wider text-xs">Report Date</th>
                  <th className="p-4 font-semibold text-textSecondary uppercase tracking-wider text-xs">Visibility Score</th>
                  <th className="p-4 font-semibold text-right text-textSecondary uppercase tracking-wider text-xs">Actions</th>
                </tr>
              </thead>
              <tbody>
                {reports.map((report) => (
                  <tr key={report.id} className="border-b border-gray-100 last:border-0 hover:bg-gray-50">
                    <td className="p-6 font-medium">{report.date}</td>
                    <td className="p-6">
                      <span className="inline-flex items-center px-3 py-1 bg-accent/20 text-accent font-bold rounded-full">
                        {report.score}%
                      </span>
                    </td>
                    <td className="p-6 text-right">
                      <div className="flex justify-end space-x-3">
                        <button className="text-textSecondary hover:text-accent transition-colors flex items-center text-sm font-medium">
                          <Eye className="w-4 h-4 mr-1" /> View
                        </button>
                        <button 
                          onClick={() => handleDownload(`Ranki_Report_${report.date.replace(/ /g, '_')}.txt`, `RANKI REPORT\nDate: ${report.date}\nScore: ${report.score}%\n`)}
                          className="text-textSecondary hover:text-accent transition-colors flex items-center text-sm font-medium"
                        >
                          <Download className="w-4 h-4 mr-1" /> Download PDF
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
}
