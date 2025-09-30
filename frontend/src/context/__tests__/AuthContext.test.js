import React from 'react';
import { render, screen } from '@testing-library/react';
import { AuthProvider } from '../AuthContext';

describe('AuthContext', () => {
  test('renders AuthProvider without crashing', () => {
    render(<AuthProvider><div>Test Child</div></AuthProvider>);
    expect(screen.getByText('Test Child')).toBeInTheDocument();
  });
});