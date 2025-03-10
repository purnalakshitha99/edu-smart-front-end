import React, { useState } from 'react';
import CalendarView from '../components/CalendarView'; // Import the renamed calendar component

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

const ClassTime= () => {
  const [lectures, setLectures] = useState<Lecture[]>([
        {
            id: 1,
            title: 'Introduction to React',
            subject: 'Web Development',
            teacher: 'Dr. Sarah Johnson',
            description: 'Learn the fundamentals of React and modern web development practices.',
            startDate: '2025-03-22',
            time: '10:00 AM - 11:30 AM',
            type: 'lecture',
            image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80'
        },
        {
            id: 2,
            title: 'Data Structures',
            subject: 'Computer Science',
            teacher: 'Prof. Michael Chen',
            description: 'Advanced concepts in data structures and algorithms.',
            startDate: '2025-03-13',
            time: '2:00 PM - 3:30 PM',
            type: 'event',
            image: 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80'
        },
        {
            id: 3,
            title: 'Machine Learning Basics',
            subject: 'Artificial Intelligence',
            teacher: 'Dr. Emily White',
            description: 'Introduction to machine learning concepts and applications.',
            startDate: '2025-03-09',
            time: '11:00 AM - 12:30 PM',
            type: 'recurring',
            image: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80'
        },
        {
            id: 4,
            title: 'Featured Talk',
            subject: 'General',
            teacher: 'Someone',
            description: 'A featured event.',
            startDate: '2025-03-09',
            time: '1:00 PM - 2:00 PM',
            type: 'featured',
            image: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80'
        }
    ]);

  const [selectedMonth, setSelectedMonth] = useState<Date>(new Date());

  const handleMonthChange = (newMonth: Date) => {
      setSelectedMonth(newMonth);
  };

  return (
    <div>
      {/* Other content for your Classroom component can go here */}
      <h1>Classroom Calendar</h1>
      <CalendarView lectures={lectures} currentMonth={selectedMonth} onMonthChange={handleMonthChange} /> {/* Render your calendar component */}
    </div>
  );
};

export default ClassTime;