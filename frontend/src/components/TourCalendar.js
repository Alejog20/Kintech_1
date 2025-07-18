import React, { useState, useEffect } from 'react';

function TourCalendar({ property, onBookTour }) {
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState('');
  const [availableSlots, setAvailableSlots] = useState({});
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [bookingData, setBookingData] = useState({
    name: '',
    email: '',
    phone: '',
    notes: ''
  });

  useEffect(() => {
    generateAvailableSlots();
  }, [currentMonth]);

  const generateAvailableSlots = () => {
    const slots = {};
    const today = new Date();
    const endDate = new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000); // Next 30 days

    // Generate available time slots (9 AM to 6 PM, excluding weekends)
    for (let d = new Date(today); d <= endDate; d.setDate(d.getDate() + 1)) {
      const dayOfWeek = d.getDay();
      if (dayOfWeek !== 0 && dayOfWeek !== 6) { // Exclude weekends
        const dateKey = d.toISOString().split('T')[0];
        slots[dateKey] = [
          '09:00', '10:00', '11:00', '12:00', 
          '14:00', '15:00', '16:00', '17:00'
        ];
      }
    }
    setAvailableSlots(slots);
  };

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    // Add all days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }
    
    return days;
  };

  const isDateAvailable = (date) => {
    if (!date) return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const dateKey = date.toISOString().split('T')[0];
    return date >= today && availableSlots[dateKey]?.length > 0;
  };

  const handleDateClick = (date) => {
    if (isDateAvailable(date)) {
      setSelectedDate(date);
      setSelectedTime('');
    }
  };

  const handleTimeSelect = (time) => {
    setSelectedTime(time);
    setShowBookingForm(true);
  };

  const handleBookingSubmit = (e) => {
    e.preventDefault();
    const tourBooking = {
      property: property,
      date: selectedDate,
      time: selectedTime,
      client: bookingData,
      type: 'tour',
      timestamp: new Date().toISOString()
    };
    
    onBookTour(tourBooking);
    
    // Reset form
    setShowBookingForm(false);
    setSelectedDate(null);
    setSelectedTime('');
    setBookingData({ name: '', email: '', phone: '', notes: '' });
    
    alert('Tour scheduled successfully! You will receive a confirmation email.');
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('en-GB', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const days = getDaysInMonth(currentMonth);

  return (
    <div className="tour-calendar">
      <div className="calendar-header">
        <h3>📅 Schedule a Property Tour</h3>
        <p>Book a guided tour with our expert agent {property.agent}</p>
      </div>

      <div className="calendar-navigation">
        <button 
          onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))}
          className="nav-btn"
        >
          ‹
        </button>
        <h4>{monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}</h4>
        <button 
          onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))}
          className="nav-btn"
        >
          ›
        </button>
      </div>

      <div className="calendar-grid">
        <div className="calendar-weekdays">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="weekday">{day}</div>
          ))}
        </div>
        
        <div className="calendar-days">
          {days.map((date, index) => (
            <div
              key={index}
              className={`calendar-day ${
                date ? (isDateAvailable(date) ? 'available' : 'unavailable') : 'empty'
              } ${selectedDate?.toDateString() === date?.toDateString() ? 'selected' : ''}`}
              onClick={() => handleDateClick(date)}
            >
              {date?.getDate()}
            </div>
          ))}
        </div>
      </div>

      {selectedDate && (
        <div className="time-slots">
          <h4>Available Times for {formatDate(selectedDate)}</h4>
          <div className="time-grid">
            {availableSlots[selectedDate.toISOString().split('T')[0]]?.map(time => (
              <button
                key={time}
                className={`time-slot ${selectedTime === time ? 'selected' : ''}`}
                onClick={() => handleTimeSelect(time)}
              >
                {time}
              </button>
            ))}
          </div>
        </div>
      )}

      {showBookingForm && (
        <div className="booking-form-overlay">
          <div className="booking-form">
            <h4>Confirm Your Tour</h4>
            <div className="booking-summary">
              <p><strong>Property:</strong> {property.title}</p>
              <p><strong>Date:</strong> {formatDate(selectedDate)}</p>
              <p><strong>Time:</strong> {selectedTime}</p>
              <p><strong>Agent:</strong> {property.agent}</p>
            </div>

            <form onSubmit={handleBookingSubmit}>
              <div className="form-group">
                <label>Full Name *</label>
                <input
                  type="text"
                  value={bookingData.name}
                  onChange={(e) => setBookingData({...bookingData, name: e.target.value})}
                  required
                />
              </div>

              <div className="form-group">
                <label>Email *</label>
                <input
                  type="email"
                  value={bookingData.email}
                  onChange={(e) => setBookingData({...bookingData, email: e.target.value})}
                  required
                />
              </div>

              <div className="form-group">
                <label>Phone Number *</label>
                <input
                  type="tel"
                  value={bookingData.phone}
                  onChange={(e) => setBookingData({...bookingData, phone: e.target.value})}
                  required
                />
              </div>

              <div className="form-group">
                <label>Special Requirements (Optional)</label>
                <textarea
                  value={bookingData.notes}
                  onChange={(e) => setBookingData({...bookingData, notes: e.target.value})}
                  placeholder="Any specific areas you'd like to focus on?"
                  rows="3"
                />
              </div>

              <div className="form-actions">
                <button type="button" onClick={() => setShowBookingForm(false)} className="btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  Confirm Tour
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="calendar-legend">
        <div className="legend-item">
          <span className="legend-color available"></span>
          <span>Available</span>
        </div>
        <div className="legend-item">
          <span className="legend-color unavailable"></span>
          <span>Unavailable</span>
        </div>
        <div className="legend-item">
          <span className="legend-color selected"></span>
          <span>Selected</span>
        </div>
      </div>
    </div>
  );
}

export default TourCalendar;