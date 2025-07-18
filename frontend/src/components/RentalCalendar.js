import React, { useState, useEffect } from 'react';

function RentalCalendar({ property, onBookRental }) {
  const [checkInDate, setCheckInDate] = useState(null);
  const [checkOutDate, setCheckOutDate] = useState(null);
  const [guests, setGuests] = useState(1);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [availability, setAvailability] = useState({});
  const [pricing, setPricing] = useState({});
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [bookingData, setBookingData] = useState({
    name: '',
    email: '',
    phone: '',
    specialRequests: ''
  });

  useEffect(() => {
    generateAvailabilityData();
  }, [currentMonth]);

  const generateAvailabilityData = () => {
    const avail = {};
    const prices = {};
    const today = new Date();
    const endDate = new Date(today.getTime() + 90 * 24 * 60 * 60 * 1000); // Next 90 days

    for (let d = new Date(today); d <= endDate; d.setDate(d.getDate() + 1)) {
      const dateKey = d.toISOString().split('T')[0];
      
      // Simulate availability (80% available, 20% booked)
      const isAvailable = Math.random() > 0.2;
      avail[dateKey] = isAvailable;
      
      // Dynamic pricing based on day of week and season
      let basePrice = property.pricePerNight || 120;
      const dayOfWeek = d.getDay();
      
      // Weekend premium
      if (dayOfWeek === 5 || dayOfWeek === 6) {
        basePrice *= 1.3;
      }
      
      // Holiday season premium (December)
      if (d.getMonth() === 11) {
        basePrice *= 1.5;
      }
      
      prices[dateKey] = Math.round(basePrice);
    }
    
    setAvailability(avail);
    setPricing(prices);
  };

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
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
    return date >= today && availability[dateKey];
  };

  const isDateInRange = (date) => {
    if (!checkInDate || !date) return false;
    if (!checkOutDate) return date.getTime() === checkInDate.getTime();
    return date >= checkInDate && date <= checkOutDate;
  };

  const handleDateClick = (date) => {
    if (!isDateAvailable(date)) return;

    if (!checkInDate || (checkInDate && checkOutDate)) {
      // Start new selection
      setCheckInDate(date);
      setCheckOutDate(null);
    } else if (date > checkInDate) {
      // Set check-out date
      setCheckOutDate(date);
    } else {
      // Reset if earlier date selected
      setCheckInDate(date);
      setCheckOutDate(null);
    }
  };

  const calculateTotalPrice = () => {
    if (!checkInDate || !checkOutDate) return 0;
    
    let total = 0;
    let nights = 0;
    
    for (let d = new Date(checkInDate); d < checkOutDate; d.setDate(d.getDate() + 1)) {
      const dateKey = d.toISOString().split('T')[0];
      total += pricing[dateKey] || property.pricePerNight || 120;
      nights++;
    }
    
    const serviceFee = total * 0.1; // 10% service fee
    const cleaningFee = 50; // Fixed cleaning fee
    
    return {
      subtotal: total,
      nights: nights,
      serviceFee: serviceFee,
      cleaningFee: cleaningFee,
      total: total + serviceFee + cleaningFee
    };
  };

  const handleBookingSubmit = (e) => {
    e.preventDefault();
    const rentalBooking = {
      property: property,
      checkIn: checkInDate,
      checkOut: checkOutDate,
      guests: guests,
      guest: bookingData,
      pricing: calculateTotalPrice(),
      type: 'rental',
      timestamp: new Date().toISOString(),
      airbnbSync: true // Flag for Airbnb integration
    };
    
    onBookRental(rentalBooking);
    
    // Reset form
    setShowBookingForm(false);
    setCheckInDate(null);
    setCheckOutDate(null);
    setGuests(1);
    setBookingData({ name: '', email: '', phone: '', specialRequests: '' });
    
    alert('Booking confirmed! You will receive confirmation details via email.');
  };

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const days = getDaysInMonth(currentMonth);
  const totalPrice = calculateTotalPrice();

  return (
    <div className="rental-calendar">
      <div className="calendar-header">
        <h3>🏠 Book Your Stay</h3>
        <p>Select your check-in and check-out dates</p>
        <div className="price-display">
          <strong>£{property.pricePerNight || 120}</strong> per night
        </div>
      </div>

      <div className="booking-controls">
        <div className="date-selection">
          <div className="date-input">
            <label>Check-in</label>
            <div className="date-display">
              {checkInDate ? checkInDate.toLocaleDateString('en-GB') : 'Select date'}
            </div>
          </div>
          <div className="date-input">
            <label>Check-out</label>
            <div className="date-display">
              {checkOutDate ? checkOutDate.toLocaleDateString('en-GB') : 'Select date'}
            </div>
          </div>
        </div>

        <div className="guest-selection">
          <label>Guests</label>
          <select value={guests} onChange={(e) => setGuests(parseInt(e.target.value))}>
            {[...Array(property.maxGuests || 8)].map((_, i) => (
              <option key={i + 1} value={i + 1}>
                {i + 1} guest{i > 0 ? 's' : ''}
              </option>
            ))}
          </select>
        </div>
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
          {days.map((date, index) => {
            const dateKey = date?.toISOString().split('T')[0];
            const price = pricing[dateKey];
            const available = isDateAvailable(date);
            const inRange = isDateInRange(date);
            const isCheckIn = checkInDate?.toDateString() === date?.toDateString();
            const isCheckOut = checkOutDate?.toDateString() === date?.toDateString();
            
            return (
              <div
                key={index}
                className={`calendar-day rental-day ${
                  date ? (available ? 'available' : 'booked') : 'empty'
                } ${inRange ? 'in-range' : ''} ${isCheckIn ? 'check-in' : ''} ${isCheckOut ? 'check-out' : ''}`}
                onClick={() => handleDateClick(date)}
              >
                {date && (
                  <>
                    <span className="day-number">{date.getDate()}</span>
                    {available && price && (
                      <span className="day-price">£{price}</span>
                    )}
                  </>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {checkInDate && checkOutDate && (
        <div className="booking-summary">
          <div className="summary-details">
            <h4>Booking Summary</h4>
            <div className="summary-line">
              <span>£{property.pricePerNight || 120} × {totalPrice.nights} nights</span>
              <span>£{totalPrice.subtotal}</span>
            </div>
            <div className="summary-line">
              <span>Service fee</span>
              <span>£{totalPrice.serviceFee.toFixed(2)}</span>
            </div>
            <div className="summary-line">
              <span>Cleaning fee</span>
              <span>£{totalPrice.cleaningFee}</span>
            </div>
            <div className="summary-line total">
              <span><strong>Total</strong></span>
              <span><strong>£{totalPrice.total.toFixed(2)}</strong></span>
            </div>
          </div>
          
          <button 
            className="reserve-btn"
            onClick={() => setShowBookingForm(true)}
          >
            Reserve Now
          </button>
        </div>
      )}

      {showBookingForm && (
        <div className="booking-form-overlay">
          <div className="booking-form">
            <h4>Complete Your Booking</h4>
            <div className="booking-details">
              <p><strong>Property:</strong> {property.title}</p>
              <p><strong>Check-in:</strong> {checkInDate.toLocaleDateString('en-GB')}</p>
              <p><strong>Check-out:</strong> {checkOutDate.toLocaleDateString('en-GB')}</p>
              <p><strong>Guests:</strong> {guests}</p>
              <p><strong>Total:</strong> £{totalPrice.total.toFixed(2)}</p>
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
                <label>Special Requests (Optional)</label>
                <textarea
                  value={bookingData.specialRequests}
                  onChange={(e) => setBookingData({...bookingData, specialRequests: e.target.value})}
                  placeholder="Any special requirements for your stay?"
                  rows="3"
                />
              </div>

              <div className="airbnb-sync">
                <div className="sync-info">
                  <span className="airbnb-icon">🅰️</span>
                  <span>This booking will be synchronized with Airbnb</span>
                </div>
              </div>

              <div className="form-actions">
                <button type="button" onClick={() => setShowBookingForm(false)} className="btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  Confirm Booking
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
          <span className="legend-color booked"></span>
          <span>Booked</span>
        </div>
        <div className="legend-item">
          <span className="legend-color selected"></span>
          <span>Selected dates</span>
        </div>
      </div>
    </div>
  );
}

export default RentalCalendar;