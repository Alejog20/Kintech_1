import React from 'react';
import { render, screen } from '@testing-library/react';
import PropertyDetail from '../PropertyDetail';
import { BrowserRouter as Router } from 'react-router-dom';

describe('PropertyDetail Page', () => {
  test('renders PropertyDetail page', () => {
    render(
      <Router>
        <PropertyDetail />
      </Router>
    );
    // You might want to add more specific assertions here based on your component's content
    expect(screen.getByText(/Property Detail/i)).toBeInTheDocument(); // Placeholder assertion
  });
});