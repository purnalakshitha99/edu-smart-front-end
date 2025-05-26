import React, { useState, useEffect } from "react";
import axios from "axios";
import { format } from "date-fns";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from "recharts";
import {
  Download,
  Clock,
  AlertTriangle,
  Loader2,
  ChevronDown,
  ChevronUp,
  Info,
  Shield,
  Eye,
  Smartphone,
  Laptop,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useNavigate } from "react-router-dom";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import UserReport from "../components/UserReport";

// Interface definitions
interface UserDetails {
  _id: string;
  username: string;
  email: string;
  profile_picture?: string | null;
  role: string;
}

interface CheatingEvent {
  event?: string;
  object?: string;
  duration?: number;
  confidence?: number;
  timestamp?: number;
}

interface AttemptEvent {
  _id: string;
  timestamp: number;
  cheating_events: CheatingEvent[];
  user_id: {
    $oid: string;
  };
}

const EthicalReportPage: React.FC = () => {
  const [userDetails, setUserDetails] = useState<UserDetails | null>(null);
  const [currentAttempt, setCurrentAttempt] = useState<number>(0);
  const [attempts, setAttempts] = useState<AttemptEvent[]>([]);
  const [currentEvents, setCurrentEvents] = useState<CheatingEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [expandedSections, setExpandedSections] = useState<{
    [key: string]: boolean;
  }>({
    summary: true,
    lookingEvents: true,
    phoneEvents: true,
    objectEvents: true,
  });
  const [error, setError] = useState<string | null>(null);
  const userId = localStorage.getItem("userid");
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  const getEventTimestamp = (
    event: CheatingEvent,
    attemptTimestamp: number
  ) => {
    return event.timestamp || attemptTimestamp || Math.floor(Date.now() / 1000);
  };

  useEffect(() => {
    const fetchEthicalReportData = async () => {
      setIsLoading(true);

      if (!userId || !token) {
        console.error("User ID or token not found in localStorage");
        navigate("/login");
        return;
      }

      try {
        const userResponse = await axios.get(
          `http://localhost:5000/auth/user/${userId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setUserDetails(userResponse.data);

        const eventsResponse = await axios.get(
          `http://localhost:5000/ethical_benchmark/report/${userId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setAttempts(eventsResponse.data);
        setCurrentEvents(
          eventsResponse.data[currentAttempt]?.cheating_events || []
        );
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Failed to load report data. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchEthicalReportData();
  }, [navigate, userId, token, currentAttempt]);

  const handleAttemptChange = (newAttempt: number) => {
    if (newAttempt >= 0 && newAttempt < attempts.length) {
      setCurrentAttempt(newAttempt);
      setCurrentEvents(attempts[newAttempt]?.cheating_events || []);
    }
  };

  const getObjectIcon = (objectType: string) => {
    switch (objectType?.toLowerCase()) {
      case "cell phone":
        return <Smartphone className="w-5 h-5 text-indigo-600" />;
      case "laptop":
        return <Laptop className="w-5 h-5 text-indigo-600" />;
      default:
        return <Info className="w-5 h-5 text-indigo-600" />;
    }
  };

  const getObjectColor = (objectType: string) => {
    switch (objectType?.toLowerCase()) {
      case "cell phone":
        return "bg-red-50 text-red-600";
      case "laptop":
        return "bg-blue-50 text-blue-600";
      default:
        return "bg-gray-50 text-gray-600";
    }
  };

  const chartData = React.useMemo(() => {
    const eventCounts: { [key: string]: number } = {};

    currentEvents.forEach((event) => {
      const eventName = event.event || event.object || "Unknown Event";
      eventCounts[eventName] = (eventCounts[eventName] || 0) + 1;
    });

    return Object.entries(eventCounts).map(([name, count], index) => ({
      name,
      count,
      color: ["#FF6B6B", "#4ECDC4", "#45B7D1"][index % 3],
    }));
  }, [currentEvents]);

  const calculateCheatingPercentage = () => {
    if (!currentEvents || currentEvents.length === 0) {
      return 0;
    }

    let totalDuration = 0;
    let cheatingDuration = 0;

    currentEvents.forEach((event) => {
      const eventTimestamp = event.timestamp;
      if (event.duration) {
        cheatingDuration += event.duration;
        totalDuration += event.duration;
      }
    });

    if (totalDuration === 0) {
      return 0;
    }

    return (cheatingDuration / totalDuration) * 100;
  };

  const calculateRiskLevel = (events: CheatingEvent[]) => {
    const totalEvents = events.length;
    const highConfidencePhoneEvents = events.filter(
      (e) => e.object === "cell phone" && (e.confidence || 0) > 70
    ).length;
    const longLookingEvents = events.filter(
      (e) => e.event?.includes("Looking") && (e.duration || 0) > 3
    ).length;

    if (totalEvents === 0)
      return {
        level: "Low",
        color: "#10B981",
        description: "No suspicious activity detected",
      };

    const riskScore = highConfidencePhoneEvents * 2 + longLookingEvents;

    if (riskScore >= 10)
      return {
        level: "Critical",
        color: "#EF4444",
        description: "Multiple high-confidence violations detected",
      };
    if (riskScore >= 5)
      return {
        level: "High",
        color: "#F59E0B",
        description: "Significant suspicious activity detected",
      };
    if (riskScore >= 2)
      return {
        level: "Medium",
        color: "#F59E0B",
        description: "Moderate suspicious activity detected",
      };
    return {
      level: "Low",
      color: "#10B981",
      description: "Minimal suspicious activity detected",
    };
  };

  const toggleSection = (section: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const getRiskColor = (level: string) => {
    switch (level.toLowerCase()) {
      case "critical":
        return "text-red-600 bg-red-50";
      case "high":
        return "text-orange-600 bg-orange-50";
      case "medium":
        return "text-yellow-600 bg-yellow-50";
      case "low":
        return "text-green-600 bg-green-50";
      default:
        return "text-gray-600 bg-gray-50";
    }
  };

  const downloadPDF = async () => {
    try {
      setIsGeneratingPDF(true);
      const cheatingPercentage = calculateCheatingPercentage();
      const riskAssessment = calculateRiskLevel(currentEvents);

      // Create a hidden container for styling the PDF with better quality settings
      const pdfContent = document.createElement("div");
      pdfContent.style.width = "650px"; // Increased from 600px for better quality
      pdfContent.style.padding = "25px"; // Increased from 20px
      pdfContent.style.fontFamily = "Arial, sans-serif";
      pdfContent.style.lineHeight = "1.4";
      pdfContent.style.backgroundColor = "#ffffff";
      pdfContent.style.transform = "scale(1)"; // Ensure crisp rendering
      pdfContent.style.transformOrigin = "top left";

      // Header with Logo and Title - more compact
      const header = document.createElement("div");
      header.style.textAlign = "center";
      header.style.marginBottom = "15px"; // Reduced from 20px
      header.style.borderBottom = "1px solid #4F46E5"; // Reduced from 2px
      header.style.paddingBottom = "10px"; // Reduced from 15px
      header.innerHTML = `
                <h1 style="color: #4F46E5; font-size: 20px; margin: 0;">EduSmart Ethical Report</h1>
                <p style="color: #6B7280; font-size: 12px; margin-top: 4px;">Generated: ${format(
                  new Date(),
                  "MMM dd, HH:mm"
                )}</p>
            `;
      pdfContent.appendChild(header);

      // User Details Section - more compact layout
      const userDetailsDiv = document.createElement("div");
      userDetailsDiv.style.marginBottom = "15px"; // Reduced from 20px
      userDetailsDiv.style.padding = "10px"; // Reduced from 15px
      userDetailsDiv.style.backgroundColor = "#F9FAFB";
      userDetailsDiv.style.borderRadius = "6px"; // Reduced from 8px
      userDetailsDiv.style.display = "flex";
      userDetailsDiv.style.gap = "15px"; // Reduced from 25px
      userDetailsDiv.innerHTML = `
                <div style="flex-shrink: 0;">
                    <img src="${
                      userDetails?.profile_picture ||
                      "https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=400&h=400&fit=crop"
                    }" 
                         style="width: 120px; height: 120px; border-radius: 50%; object-fit: cover; border: 2px solid #4F46E5;" />
                </div>
                <div style="flex-grow: 1; display: grid; grid-template-columns: 1fr 1fr; gap: 8px;">
                    <div>
                        <p style="margin: 2px 0; font-size: 11px;"><strong style="color: #4B5563;">Name:</strong> <span style="color: #1F2937;">${
                          userDetails?.username || "N/A"
                        }</span></p>
                        <p style="margin: 2px 0; font-size: 11px;"><strong style="color: #4B5563;">Email:</strong> <span style="color: #1F2937;">${
                          userDetails?.email || "N/A"
                        }</span></p>
                        <p style="margin: 2px 0; font-size: 11px;"><strong style="color: #4B5563;">Role:</strong> <span style="color: #1F2937;">${
                          userDetails?.role || "Student"
                        }</span></p>
                    </div>
                    <div style="background: ${
                      riskAssessment.color
                    }15; padding: 8px; border-radius: 4px; border: 1px solid ${
        riskAssessment.color
      }30;">
                        <p style="margin: 2px 0; font-size: 11px;"><strong style="color: #4B5563;">Risk:</strong> 
                            <span style="color: ${
                              riskAssessment.color
                            }; font-weight: bold;">${
        riskAssessment.level
      }</span>
                        </p>
                        <p style="margin: 2px 0; font-size: 10px; color: #6B7280;">${
                          riskAssessment.description
                        }</p>
                    </div>
                </div>
            `;
      pdfContent.appendChild(userDetailsDiv);

      // Summary Statistics Section - more compact
      const summaryDiv = document.createElement("div");
      summaryDiv.style.marginBottom = "15px"; // Reduced from 20px
      summaryDiv.style.padding = "10px"; // Reduced from 15px
      summaryDiv.style.backgroundColor = "#F9FAFB";
      summaryDiv.style.borderRadius = "6px"; // Reduced from 8px

      // Calculate statistics
      const totalEvents = currentEvents.length;
      const lookingEvents = currentEvents.filter((e) =>
        e.event?.includes("Looking")
      ).length;
      const cellPhoneEvents = currentEvents.filter(
        (e) => e.object === "cell phone"
      ).length;
      const avgConfidence = (() => {
        const eventsWithConfidence = currentEvents.filter(
          (e) => e.confidence !== undefined
        );
        if (eventsWithConfidence.length === 0) return 0;

        const totalConfidence = eventsWithConfidence.reduce(
          (sum, event) => sum + (event.confidence || 0),
          0
        );
        return totalConfidence / eventsWithConfidence.length;
      })();

      summaryDiv.innerHTML = `
                <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 8px;">
                    <div style="padding: 8px; background: white; border-radius: 4px; box-shadow: 0 1px 1px rgba(0,0,0,0.1);">
                        <p style="color: #6B7280; margin: 0; font-size: 10px;">Total Events</p>
                        <p style="color: #4F46E5; font-size: 16px; font-weight: bold; margin: 2px 0;">${totalEvents}</p>
                    </div>
                    <div style="padding: 8px; background: white; border-radius: 4px; box-shadow: 0 1px 1px rgba(0,0,0,0.1);">
                        <p style="color: #6B7280; margin: 0; font-size: 10px;">Looking Events</p>
                        <p style="color: #4F46E5; font-size: 16px; font-weight: bold; margin: 2px 0;">${lookingEvents}</p>
                    </div>
                    <div style="padding: 8px; background: white; border-radius: 4px; box-shadow: 0 1px 1px rgba(0,0,0,0.1);">
                        <p style="color: #6B7280; margin: 0; font-size: 10px;">Phone Detections</p>
                        <p style="color: #4F46E5; font-size: 16px; font-weight: bold; margin: 2px 0;">${cellPhoneEvents}</p>
                    </div>
                    <div style="padding: 8px; background: white; border-radius: 4px; box-shadow: 0 1px 1px rgba(0,0,0,0.1);">
                        <p style="color: #6B7280; margin: 0; font-size: 10px;">Avg. Confidence</p>
                        <p style="color: #4F46E5; font-size: 16px; font-weight: bold; margin: 2px 0;">${avgConfidence.toFixed(
                          1
                        )}%</p>
                    </div>
                </div>
            `;
      pdfContent.appendChild(summaryDiv);

      // Detailed Events Section - more compact
      const eventsDiv = document.createElement("div");
      eventsDiv.style.marginBottom = "15px"; // Reduced from 20px

      // Create tables for different event types - more compact
      const createEventTable = (
        title: string,
        events: any[],
        type: "looking" | "object"
      ) => {
        // Only show top 10 events to reduce size
        const topEvents = events.slice(0, 10);
        const tableDiv = document.createElement("div");
        tableDiv.style.marginBottom = "10px"; // Reduced from 15px
        tableDiv.innerHTML = `
                    <h3 style="color: #4B5563; font-size: 12px; margin-bottom: 6px;">${title} (Top 10)</h3>
                    <table style="width: 100%; border-collapse: collapse; margin-bottom: 10px; font-size: 10px;">
                        <thead>
                            <tr style="background-color: #F3F4F6;">
                                <th style="padding: 6px; text-align: left; border: 1px solid #E5E7EB;">Time</th>
                                <th style="padding: 6px; text-align: left; border: 1px solid #E5E7EB;">Event</th>
                                ${
                                  type === "looking"
                                    ? '<th style="padding: 6px; text-align: left; border: 1px solid #E5E7EB;">Duration</th>'
                                    : '<th style="padding: 6px; text-align: left; border: 1px solid #E5E7EB;">Confidence</th>'
                                }
                            </tr>
                        </thead>
                        <tbody>
                            ${topEvents
                              .map(
                                (event) => `
                                <tr style="border-bottom: 1px solid #E5E7EB;">
                                    <td style="padding: 6px; border: 1px solid #E5E7EB;">${format(
                                      new Date(event.timestamp * 1000),
                                      "HH:mm:ss"
                                    )}</td>
                                    <td style="padding: 6px; border: 1px solid #E5E7EB;">${
                                      type === "looking"
                                        ? event.event
                                        : event.object
                                    }</td>
                                    <td style="padding: 6px; border: 1px solid #E5E7EB;">
                                        ${
                                          type === "looking"
                                            ? event.duration.toFixed(1)
                                            : `<div style="background: #E5E7EB; height: 4px; border-radius: 2px;">
                                                <div style="background: #4F46E5; height: 100%; width: ${
                                                  event.confidence
                                                }%; border-radius: 2px;"></div>
                                            </div>
                                            <span style="font-size: 9px; color: #6B7280;">${event.confidence.toFixed(
                                              0
                                            )}%</span>`
                                        }
                                    </td>
                    </tr>
                            `
                              )
                              .join("")}
                        </tbody>
                    </table>
                    ${
                      events.length > 10
                        ? `<p style="font-size: 9px; color: #6B7280; text-align: right;">+${
                            events.length - 10
                          } more events</p>`
                        : ""
                    }
                `;
        return tableDiv;
      };

      // Update the event lists
      const lookingEventsList = currentEvents
        .filter((e) => e.event?.includes("Looking"))
        .map((e) => ({
          ...e,
          timestamp: getEventTimestamp(
            e,
            attempts[currentAttempt]?.timestamp || 0
          ),
        }));

      const objectEventsList = currentEvents
        .filter((e) => e.object === "cell phone")
        .map((e) => ({
          ...e,
          timestamp: getEventTimestamp(
            e,
            attempts[currentAttempt]?.timestamp || 0
          ),
        }));

      eventsDiv.appendChild(
        createEventTable("Looking Events", lookingEventsList, "looking")
      );
      eventsDiv.appendChild(
        createEventTable("Cell Phone Detections", objectEventsList, "object")
      );
      pdfContent.appendChild(eventsDiv);

      // Footer - more compact
      const footer = document.createElement("div");
      footer.style.marginTop = "15px"; // Reduced from 20px
      footer.style.paddingTop = "10px"; // Reduced from 15px
      footer.style.borderTop = "1px solid #E5E7EB";
      footer.style.textAlign = "center";
      footer.style.color = "#6B7280";
      footer.style.fontSize = "9px"; // Reduced from 11px
      footer.innerHTML = `
                <p style="margin: 2px 0;">EduSmart Ethical Monitoring System</p>
            `;
      pdfContent.appendChild(footer);

      // Convert to PDF with improved quality settings
      document.body.appendChild(pdfContent);
      const canvas = await html2canvas(pdfContent, {
        scale: 2, // Increased from 1.2 for better quality
        logging: false,
        useCORS: true,
        allowTaint: true,
        imageTimeout: 0, // Prevent image timeout
        removeContainer: true, // Clean up
        backgroundColor: "#ffffff",
        onclone: (clonedDoc) => {
          // Ensure all images are loaded
          const images = clonedDoc.getElementsByTagName("img");
          return Promise.all(
            Array.from(images).map((img) => {
              if (img.complete) return Promise.resolve();
              return new Promise((resolve) => {
                img.onload = resolve;
                img.onerror = resolve;
              });
            })
          );
        },
      });
      document.body.removeChild(pdfContent);

      // Use higher quality image settings
      const imgData = canvas.toDataURL("image/jpeg", 0.92); // Using JPEG with higher quality
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
        compress: true, // Enable PDF compression
      });

      // Calculate dimensions to maintain aspect ratio
      const imgWidth = 190; // Increased from 170
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      // Add image with better quality settings
      pdf.addImage(
        imgData,
        "JPEG",
        10,
        10,
        imgWidth,
        imgHeight,
        undefined,
        "FAST"
      );

      // Save with better quality settings
      pdf
        .save(
          `EthicalReport_${userDetails?.username || "Student"}_${format(
            new Date(),
            "yyyyMMdd_HHmm"
          )}.pdf`,
          {
            returnPromise: true,
          }
        )
        .then(() => {
          console.log("PDF generated successfully with improved quality");
        })
        .catch((error) => {
          console.error("Error saving PDF:", error);
        });
    } catch (error: any) {
      console.error("Error generating PDF:", error);
      setError("Failed to generate PDF. Please try again.");
    } finally {
      setIsGeneratingPDF(false);
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

  const renderLookingEventsTable = () => (
    <tbody className="bg-white divide-y divide-gray-200">
      {currentEvents
        .filter((e) => e.event?.includes("Looking"))
        .map((event, index) => {
          const eventTimestamp = getEventTimestamp(
            event,
            attempts[currentAttempt]?.timestamp || 0
          );
          return (
            <tr
              key={`${eventTimestamp}-${index}`}
              className="hover:bg-gray-50 transition-colors"
            >
              <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
                {format(new Date(eventTimestamp * 1000), "HH:mm:ss")}
              </td>
              <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-800">
                {event.event}
              </td>
              <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
                {event.duration?.toFixed(1)}s
              </td>
            </tr>
          );
        })}
    </tbody>
  );

  const renderPhoneEventsTable = () => (
    <tbody className="bg-white divide-y divide-gray-200">
      {currentEvents
        .filter((e) => e.object === "cell phone")
        .map((event, index) => {
          const eventTimestamp = getEventTimestamp(
            event,
            attempts[currentAttempt]?.timestamp || 0
          );
          return (
            <tr
              key={`${eventTimestamp}-${index}`}
              className="hover:bg-gray-50 transition-colors"
            >
              <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
                {format(new Date(eventTimestamp * 1000), "HH:mm:ss")}
              </td>
              <td className="px-4 py-3 whitespace-nowrap">
                <div className="flex items-center gap-2">
                  <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-indigo-600 rounded-full"
                      style={{ width: `${event.confidence}%` }}
                    />
                  </div>
                  <span className="text-sm text-gray-600">
                    {event.confidence?.toFixed(1)}%
                  </span>
                </div>
              </td>
            </tr>
          );
        })}
    </tbody>
  );

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-indigo-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading report data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-8">
        <Navbar />
        <div className="max-w-6xl mx-auto mt-8">
          <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
            <AlertTriangle className="w-12 h-12 text-red-600 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-red-800 mb-2">
              Error Loading Report
            </h2>
            <p className="text-red-600 mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Navbar />
      <div className="max-w-6xl mx-auto p-4 sm:p-6 lg:p-8">
        {/* Header Section with Attempt Navigation */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <div className="flex items-center gap-4 mb-2">
                <h1 className="text-2xl font-bold text-gray-800">
                  Student Exam Cheating Report
                </h1>
                <div className="flex items-center gap-2 bg-indigo-50 px-3 py-1 rounded-lg">
                  <button
                    onClick={() => handleAttemptChange(currentAttempt - 1)}
                    disabled={currentAttempt === 0}
                    className={`p-1 rounded ${
                      currentAttempt === 0
                        ? "text-gray-400"
                        : "text-indigo-600 hover:bg-indigo-100"
                    }`}
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <span className="text-sm font-medium text-indigo-600">
                    Attempt {currentAttempt + 1} of {attempts.length}
                  </span>
                  <button
                    onClick={() => handleAttemptChange(currentAttempt + 1)}
                    disabled={currentAttempt === attempts.length - 1}
                    className={`p-1 rounded ${
                      currentAttempt === attempts.length - 1
                        ? "text-gray-400"
                        : "text-indigo-600 hover:bg-indigo-100"
                    }`}
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
              <p className="text-gray-600">
                Generated on{" "}
                {format(
                  new Date(
                    attempts[currentAttempt]?.timestamp * 1000 || Date.now()
                  ),
                  "MMMM dd, yyyy 'at' HH:mm"
                )}
              </p>
            </div>
            <button
              onClick={downloadPDF}
              disabled={isGeneratingPDF}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl transition-all ${
                isGeneratingPDF
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-indigo-600 hover:bg-indigo-700 shadow-lg hover:shadow-xl"
              } text-white`}
            >
              {isGeneratingPDF ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Generating PDF...
                </>
              ) : (
                <>
                  <Download className="w-5 h-5" />
                  Download PDF Report
                </>
              )}
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - User Info and Attempt Summary */}
          <div className="lg:col-span-1 space-y-6">
            {/* <div className="bg-white rounded-xl shadow-lg p-6">
                            <div className="text-center">
                                <img
                                    src={userDetails?.profile_picture || 'https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=400&h=400&fit=crop'}
                                    alt="Student Profile"
                                    className="w-32 h-32 rounded-full mx-auto mb-4 border-4 border-indigo-100 shadow-lg"
                                />
                                <h2 className="text-xl font-bold text-gray-800 mb-1">{userDetails?.username}</h2>
                                <p className="text-gray-600 mb-4">{userDetails?.email}</p>
                                <div className="flex items-center justify-center gap-2 text-gray-500 mb-4">
                                    <Clock className="w-4 h-4" />
                                    <span>Exam Date: {format(new Date(), "MMMM dd, yyyy")}</span>
                                </div>
                            </div>
                        </div> */}

            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="text-center">
                <img
                  src={
                    userDetails?.profile_picture ||
                    "https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=400&h=400&fit=crop"
                  }
                  alt="Student Profile"
                  className="w-32 h-32 rounded-lg mx-auto mb-4 border-4 border-indigo-100 shadow-lg" // changed from rounded-full to rounded-lg
                />
                <h2 className="text-xl font-bold text-gray-800 mb-1">
                  {userDetails?.username}
                </h2>
                <p className="text-gray-600 mb-4">{userDetails?.email}</p>
                <div className="flex items-center justify-center gap-2 text-gray-500 mb-4">
                  <Clock className="w-4 h-4" />
                  <span>Exam Date: {format(new Date(), "MMMM dd, yyyy")}</span>
                </div>
              </div>
            </div>

            {/* Attempt Summary Card */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center gap-3 mb-4">
                <Clock className="w-6 h-6 text-indigo-600" />
                <h3 className="text-lg font-semibold text-gray-800">
                  Attempt Summary
                </h3>
              </div>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-sm text-gray-600">Start Time</p>
                    <p className="font-semibold text-gray-800">
                      {format(
                        new Date(
                          attempts[currentAttempt]?.timestamp * 1000 ||
                            Date.now()
                        ),
                        "HH:mm:ss"
                      )}
                    </p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-sm text-gray-600">Total Events</p>
                    <p className="font-semibold text-gray-800">
                      {currentEvents.length}
                    </p>
                  </div>
                </div>
                <div className="space-y-2">
                  {Object.entries(
                    currentEvents.reduce(
                      (acc: { [key: string]: number }, event) => {
                        if (event.object) {
                          acc[event.object] = (acc[event.object] || 0) + 1;
                        }
                        return acc;
                      },
                      {}
                    ) || {}
                  ).map(([object, count]) => (
                    <div
                      key={object}
                      className={`flex items-center justify-between p-2 rounded-lg ${getObjectColor(
                        object
                      )}`}
                    >
                      <div className="flex items-center gap-2">
                        {getObjectIcon(object)}
                        <span className="font-medium capitalize">{object}</span>
                      </div>
                      <span className="font-semibold">{count} detections</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Risk Assessment Card */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center gap-3 mb-4">
                <Shield className="w-6 h-6 text-indigo-600" />
                <h3 className="text-lg font-semibold text-gray-800">
                  Risk Assessment
                </h3>
              </div>
              {(() => {
                const risk = calculateRiskLevel(currentEvents);
                return (
                  <div className={`p-4 rounded-lg ${getRiskColor(risk.level)}`}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-semibold">Risk Level</span>
                      <span className="font-bold">{risk.level}</span>
                    </div>
                    <p className="text-sm">{risk.description}</p>
                  </div>
                );
              })()}
            </div>
          </div>

          {/* Right Column - Events and Charts */}
          <div className="lg:col-span-2 space-y-6">
            {/* Summary Statistics */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div
                className="flex items-center justify-between cursor-pointer mb-4"
                onClick={() => toggleSection("summary")}
              >
                <h3 className="text-lg font-semibold text-gray-800">
                  Summary Statistics
                </h3>
                {expandedSections.summary ? (
                  <ChevronUp className="w-5 h-5" />
                ) : (
                  <ChevronDown className="w-5 h-5" />
                )}
              </div>
              {expandedSections.summary && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-gray-50 rounded-lg p-4 text-center">
                    <p className="text-sm text-gray-600 mb-1">Total Events</p>
                    <p className="text-2xl font-bold text-indigo-600">
                      {currentEvents.length}
                    </p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4 text-center">
                    <p className="text-sm text-gray-600 mb-1">Looking Events</p>
                    <p className="text-2xl font-bold text-indigo-600">
                      {
                        currentEvents.filter((e) =>
                          e.event?.includes("Looking")
                        ).length
                      }
                    </p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4 text-center">
                    <p className="text-sm text-gray-600 mb-1">
                      Phone Detections
                    </p>
                    <p className="text-2xl font-bold text-indigo-600">
                      {
                        currentEvents.filter((e) => e.object === "cell phone")
                          .length
                      }
                    </p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4 text-center">
                    <p className="text-sm text-gray-600 mb-1">
                      Avg. Confidence
                    </p>
                    <p className="text-2xl font-bold text-indigo-600">
                      {(() => {
                        const eventsWithConfidence = currentEvents.filter(
                          (e) => e.confidence !== undefined
                        );
                        if (eventsWithConfidence.length === 0) return "0%";

                        const totalConfidence = eventsWithConfidence.reduce(
                          (sum, event) => sum + (event.confidence || 0),
                          0
                        );
                        const average =
                          totalConfidence / eventsWithConfidence.length;
                        return `${average.toFixed(1)}%`;
                      })()}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Events Distribution Chart */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Events Distribution
              </h3>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                    <XAxis
                      dataKey="name"
                      tick={{ fill: "#4B5563", fontSize: 12 }}
                      axisLine={{ stroke: "#9CA3AF" }}
                    />
                    <YAxis
                      tick={{ fill: "#4B5563", fontSize: 12 }}
                      axisLine={{ stroke: "#9CA3AF" }}
                    />
                    <Tooltip
                      content={<CustomTooltip />}
                      cursor={{ fill: "rgba(79, 70, 229, 0.1)" }}
                    />
                    <Legend />
                    <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                      {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Object Detection Events */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div
                className="flex items-center justify-between cursor-pointer mb-4"
                onClick={() => toggleSection("objectEvents")}
              >
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-indigo-50 rounded-lg">
                    <Eye className="w-5 h-5 text-indigo-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">
                      Object Detections
                    </h3>
                    <p className="text-sm text-gray-500">
                      Real-time detection confidence levels
                    </p>
                  </div>
                </div>
                {expandedSections.objectEvents ? (
                  <ChevronUp className="w-5 h-5" />
                ) : (
                  <ChevronDown className="w-5 h-5" />
                )}
              </div>
              {expandedSections.objectEvents && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Object.entries(
                    currentEvents.reduce(
                      (acc: { [key: string]: CheatingEvent[] }, event) => {
                        if (event.object) {
                          if (!acc[event.object]) {
                            acc[event.object] = [];
                          }
                          acc[event.object].push(event);
                        }
                        return acc;
                      },
                      {}
                    )
                  ).map(([object, events]) => {
                    // Calculate statistics for this object type
                    const totalEvents = events.length;
                    const avgConfidence =
                      events.reduce(
                        (sum, event) => sum + (event.confidence || 0),
                        0
                      ) / totalEvents;
                    const highConfidenceEvents = events.filter(
                      (e) => (e.confidence || 0) > 70
                    ).length;
                    const riskLevel =
                      highConfidenceEvents > 0
                        ? highConfidenceEvents / totalEvents > 0.5
                          ? "high"
                          : "medium"
                        : "low";

                    return (
                      <div
                        key={object}
                        className="bg-gray-50 rounded-lg overflow-hidden border border-gray-100"
                      >
                        <div className="p-3 bg-white border-b border-gray-100">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              {getObjectIcon(object)}
                              <div>
                                <h4 className="font-semibold text-gray-800 capitalize">
                                  {object}
                                </h4>
                                <div className="flex items-center gap-2 mt-0.5">
                                  <span
                                    className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                                      riskLevel === "high"
                                        ? "bg-red-100 text-red-700"
                                        : riskLevel === "medium"
                                        ? "bg-yellow-100 text-yellow-700"
                                        : "bg-green-100 text-green-700"
                                    }`}
                                  >
                                    {riskLevel === "high"
                                      ? "High Risk"
                                      : riskLevel === "medium"
                                      ? "Medium Risk"
                                      : "Low Risk"}
                                  </span>
                                  <span className="text-xs text-gray-500">
                                    {totalEvents} detections
                                  </span>
                                </div>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="text-sm font-medium text-gray-900">
                                {avgConfidence.toFixed(0)}%
                              </div>
                              <div className="text-xs text-gray-500">
                                avg. confidence
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="p-3">
                          <div className="space-y-1.5 max-h-[100px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 hover:scrollbar-thumb-gray-400">
                            {events.slice(0, 5).map((event, index) => (
                              <div
                                key={index}
                                className="flex items-center gap-2 group"
                              >
                                <div className="flex-grow h-1.5 bg-gray-200 rounded-full overflow-hidden">
                                  <div
                                    className={`h-full rounded-full transition-all duration-300 ${
                                      event.confidence && event.confidence > 70
                                        ? "bg-red-500"
                                        : event.confidence &&
                                          event.confidence > 50
                                        ? "bg-yellow-500"
                                        : "bg-green-500"
                                    }`}
                                    style={{ width: `${event.confidence}%` }}
                                  />
                                </div>
                                <span className="text-xs text-gray-600 w-12 text-right opacity-0 group-hover:opacity-100 transition-opacity">
                                  {event.confidence?.toFixed(0)}%
                                </span>
                              </div>
                            ))}
                            {events.length > 5 && (
                              <div className="text-xs text-gray-500 text-right mt-1 bg-gray-100/50 py-1 px-2 rounded">
                                +{events.length - 5} more detections
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Detailed Events Timeline */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div
                className="flex items-center justify-between cursor-pointer mb-4"
                onClick={() => toggleSection("lookingEvents")}
              >
                <div className="flex items-center gap-2">
                  <Eye className="w-5 h-5 text-indigo-600" />
                  <h3 className="text-lg font-semibold text-gray-800">
                    Looking Events
                  </h3>
                </div>
                {expandedSections.lookingEvents ? (
                  <ChevronUp className="w-5 h-5" />
                ) : (
                  <ChevronDown className="w-5 h-5" />
                )}
              </div>
              {expandedSections.lookingEvents && (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead>
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50">
                          Time
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50">
                          Event
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50">
                          Duration
                        </th>
                      </tr>
                    </thead>
                    {renderLookingEventsTable()}
                  </table>
                </div>
              )}
            </div>

            {/* Phone Detection Events */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div
                className="flex items-center justify-between cursor-pointer mb-4"
                onClick={() => toggleSection("phoneEvents")}
              >
                <div className="flex items-center gap-2">
                  <Smartphone className="w-5 h-5 text-indigo-600" />
                  <h3 className="text-lg font-semibold text-gray-800">
                    Phone Detections
                  </h3>
                </div>
                {expandedSections.phoneEvents ? (
                  <ChevronUp className="w-5 h-5" />
                ) : (
                  <ChevronDown className="w-5 h-5" />
                )}
              </div>
              {expandedSections.phoneEvents && (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead>
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50">
                          Time
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50">
                          Confidence
                        </th>
                      </tr>
                    </thead>
                    {renderPhoneEventsTable()}
                  </table>
                </div>
              )}
            </div>

        
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default EthicalReportPage;
