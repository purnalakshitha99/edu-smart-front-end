import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { format } from 'date-fns';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';
import html2pdf from 'html2pdf.js'; // Import html2pdf.js
import { Download, Clock, AlertTriangle } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useNavigate } from 'react-router-dom';

// Interface definitions
interface UserDetails {
  _id: string;
  username: string;
  email: string;
  profile_picture?: string | null;
  role: string;
}

interface CheatingEvent {
  id: number;
  timestamp: number;
  cheating_events: any[];
  userId: string;
}

const EthicalReportPage: React.FC = () => {
  const [userDetails, setUserDetails] = useState<UserDetails | null>(null);
  const [cheatingEvents, setCheatingEvents] = useState<CheatingEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const userId = localStorage.getItem('userid');
  const token = localStorage.getItem('token');
  const navigate = useNavigate();
  const [selectedEvent, setSelectedEvent] = useState<CheatingEvent | null>(null);

  useEffect(() => {
    const fetchEthicalReportData = async () => {
      setIsLoading(true);

      if (!userId || !token) {
        console.error("User ID or token not found in localStorage");
        navigate('/login');
        return;
      }

      try {
        const userResponse = await axios.get(`http://localhost:5000/auth/user/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUserDetails(userResponse.data);

        const eventsResponse = await axios.get(`http://localhost:5000/ethical_benchmark/report/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCheatingEvents(eventsResponse.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchEthicalReportData();
  }, [navigate, userId, token]);

  const chartData = React.useMemo(() => {
    const eventCounts: { [key: string]: number } = {};

    cheatingEvents.forEach((event) => {
      event.cheating_events.forEach((cheatingEvent: any) => {
        const eventName = cheatingEvent.event || cheatingEvent.object || 'Unknown Event';
        eventCounts[eventName] = (eventCounts[eventName] || 0) + 1;
      });
    });

    return Object.entries(eventCounts).map(([name, count], index) => ({
      name,
      count,
      color: ['#FF6B6B', '#4ECDC4', '#45B7D1'][index % 3],
    }));
  }, [cheatingEvents]);

  const downloadPDF = () => {
    try {
      const element = document.getElementById('report-content'); // Target the report content
      const opt = {
        margin: 1,
        filename: `EthicalReport_${userDetails?.username || 'Student'}_${format(new Date(), 'yyyyMMdd')}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' },
      };

      html2pdf().from(element).set(opt).save();
    } catch (error) {
      console.error("Error generating PDF:", error);
      alert("Failed to generate PDF. Please try again: " + (error as Error).message);
    }
  };

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 shadow-lg rounded-lg border">
          <p className="font-semibold">{payload[0].payload.name}</p>
          <p className="text-gray-600">Occurrences: {payload[0].value}</p>
        </div>
      );
    }
    return null;
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-8">
      <Navbar />
      <div className="max-w-6xl mx-auto">
        <div id="report-content" className="bg-white rounded-xl shadow-xl p-8 mb-8">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold text-gray-800">Student Exam Cheating Report</h1>
            <div className="flex items-center gap-2 text-red-500">
              <AlertTriangle size={24} />
              <span className="font-semibold">Multiple Violations Detected</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div className="md:col-span-1">
              <div className="bg-gray-50 rounded-xl p-6 text-center">
                <img
                  src={
                    userDetails?.profile_picture ||
                    'https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=400&h=400&fit=crop'
                  }
                  alt="Student Profile"
                  className="w-32 h-32 rounded-full mx-auto mb-4 border-4 border-white shadow-lg"
                />
                <h2 className="text-xl font-bold mb-2">{userDetails?.username}</h2>
                <p className="text-gray-600 mb-2">Email: {userDetails?.email}</p>
                <div className="flex items-center justify-center gap-2 text-gray-500">
                  <Clock size={16} />
                  <span>Exam Date: March 15, 2024</span>
                </div>
              </div>
            </div>

            <div className="md:col-span-2">
              <div className="bg-gray-50 rounded-xl p-6 h-full">
                <h2 className="text-xl font-semibold mb-4">Cheating Events Distribution</h2>
                <div className="w-full h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                      <XAxis dataKey="name" tick={{ fill: '#4B5563' }} axisLine={{ stroke: '#9CA3AF' }} />
                      <YAxis tick={{ fill: '#4B5563' }} axisLine={{ stroke: '#9CA3AF' }} />
                      <Tooltip content={<CustomTooltip />} />
                      <Legend />
                      <Bar dataKey="count" fill="#4F46E5" radius={[4, 4, 0, 0]}>
                        {chartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 rounded-xl p-6 mb-8">
            <h2 className="text-xl font-semibold mb-4">Detailed Events Timeline</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-100 rounded-tl-lg">
                      Time
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-100 rounded-tr-lg">
                      Event
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {cheatingEvents.map((event, index) => (
                    <tr
                      key={index}
                      className="hover:bg-gray-50 cursor-pointer transition-colors"
                      onClick={() => setSelectedEvent(event)}
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {format(new Date(event.timestamp * 1000), 'HH:mm')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                        {event.cheating_events
                          .map(
                            (cheatingEvent: any) =>
                              `${cheatingEvent.object ? `Object: ${cheatingEvent.object}, ` : ''}${
                                cheatingEvent.event ? `Event: ${cheatingEvent.event}, ` : ''
                              } ${cheatingEvent.duration ? `Duration: ${cheatingEvent.duration}s` : ''}`
                          )
                          .join(', ')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              onClick={downloadPDF}
              className="flex items-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-xl hover:bg-indigo-700 transition-colors shadow-lg hover:shadow-xl"
            >
              <Download size={20} />
              Download PDF Report
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default EthicalReportPage;