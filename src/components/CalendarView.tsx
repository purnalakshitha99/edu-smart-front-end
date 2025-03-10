import React, { useState } from 'react';
import { useNavigate } from "react-router-dom"
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, addMonths, subMonths, startOfWeek, endOfWeek } from 'date-fns';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Clock, User, BookOpen } from 'lucide-react'; // Rename the imported icon

interface Lecture {
  id: number;
  title: string;
  subject: string;
  teacher: string;
  description: string;
  startDate: string;
  time: string;
  type: 'lecture' | 'event' | 'recurring' | 'featured';
  image: string;
}

const eventColors: { [key in Lecture['type']]: string } = {
    'lecture': 'bg-indigo-100 text-indigo-800',
    'event': 'bg-red-100 text-red-800',
    'recurring': 'bg-yellow-100 text-yellow-800',
    'featured': 'bg-orange-100 text-orange-800'
};


interface CalendarViewProps {
    lectures: Lecture[];
    currentMonth: Date;
    onMonthChange: (newMonth: Date) => void;
}

function CalendarView({ lectures, currentMonth, onMonthChange }: CalendarViewProps) {
   const navigate = useNavigate();
  const [selectedLecture, setSelectedLecture] = useState<Lecture | null>(null);
  const [showModal, setShowModal] = useState<boolean>(false);

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const calendarStart = startOfWeek(monthStart);
  const calendarEnd = endOfWeek(monthEnd);
  const daysInCalendar = eachDayOfInterval({ start: calendarStart, end: calendarEnd });


  const nextMonth = () => {
      const newMonth = addMonths(currentMonth, 1);
      onMonthChange(newMonth);
  };
  const prevMonth = () => {
      const newMonth = subMonths(currentMonth, 1);
      onMonthChange(newMonth);
  };

  const handleLectureClick = (lecture: Lecture) => {
    setSelectedLecture(lecture);
    setShowModal(true);
  };

  const maxEventsToShow = 2;

  return (
    <div className="max-w-6xl p-6 mx-auto">
      <div className="overflow-hidden bg-white border border-gray-300 rounded-lg shadow-lg">
        {/* Calendar Header */}
        <div className="flex items-center justify-between px-6 py-4 text-white bg-gray-800">
          <div className="flex items-center space-x-4">
            <CalendarIcon className="w-6 h-6" />
            <h2 className="text-xl font-semibold">
              {format(currentMonth, 'MMMM yyyy')}
            </h2>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={prevMonth}
              className="p-2 transition-colors rounded-full hover:bg-gray-700"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={nextMonth}
              className="p-2 transition-colors rounded-full hover:bg-gray-700"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7">
          {['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY'].map((day) => (
            <div key={day} className="px-2 py-3 text-sm font-medium text-center text-gray-600 bg-gray-100 border-b border-r last:border-r-0">
              {day}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7">
          {daysInCalendar.map((day, idx) => {
            const dayLectures = lectures.filter(lecture =>
              isSameDay(new Date(lecture.startDate), day)
            );
            const isCurrentMonth = day.getMonth() === currentMonth.getMonth();
            const isToday = isSameDay(day, new Date());

            return (
              <div
                key={idx}
                className={`min-h-[120px] p-2 border-b border-r relative ${
                  !isCurrentMonth ? 'bg-gray-50 text-gray-400' : 'bg-white text-gray-700'
                } ${isToday ? 'bg-blue-50' : ''}`}
              >
                <div className="text-right">
                  <span className={`inline-block rounded-full w-7 h-7 text-sm leading-7 text-center
                    ${isToday ? 'bg-blue-500 text-white' : 'text-gray-700'}`}>
                    {format(day, 'd')}
                  </span>
                </div>

                <div className="mt-2 space-y-1">
                  {dayLectures.slice(0, maxEventsToShow).map((lecture) => (
                    <div
                      key={lecture.id}
                      onClick={() => handleLectureClick(lecture)}
                      className={`px-2 py-1.5 rounded cursor-pointer hover:opacity-75 transition-opacity text-xs font-medium truncate ${eventColors[lecture.type]}`}
                    >
                      {lecture.title}
                    </div>
                  ))}
                  {dayLectures.length > maxEventsToShow && (
                    <button className="text-xs text-blue-500">Show More</button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Lecture Modal */}
      {showModal && selectedLecture && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="w-full max-w-lg p-6 mx-4 bg-white rounded-lg shadow-lg">
            <div className="relative">
              <img
                src={selectedLecture.image}
                alt={selectedLecture.title}
                className="object-cover w-full h-48 mb-4 rounded-lg"
              />
              <button
                onClick={() => setShowModal(false)}
                className="absolute p-1 bg-white rounded-full shadow-lg top-2 right-2 hover:bg-gray-100"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <h3 className="mb-2 text-2xl font-bold">{selectedLecture.title}</h3>

            <div className="mb-4 space-y-3">
              <div className="flex items-center text-gray-600">
                <BookOpen className="w-5 h-5 mr-2" />
                <span>{selectedLecture.subject}</span>
              </div>
              <div className="flex items-center text-gray-600">
                <User className="w-5 h-5 mr-2" />
                <span>{selectedLecture.teacher}</span>
              </div>
              <div className="flex items-center text-gray-600">
                <Clock className="w-5 h-5 mr-2" />
                <span>{selectedLecture.time}</span>
              </div>
            </div>

            <p className="mb-4 text-gray-600">{selectedLecture.description}</p>

            <button
              onClick={() => navigate("/Classroom")}
              className="w-full py-2 text-white transition-colors bg-indigo-600 rounded-lg hover:bg-indigo-700"
            >
              ATTEND A CLASS
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default CalendarView;