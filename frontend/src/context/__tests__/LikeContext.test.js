import React from 'react';
import { render, screen } from '@testing-library/react';
import { LikeProvider } from '../LikeContext';
import { AuthProvider } from '../AuthContext'; // Import AuthProvider

describe('LikeContext', () => {
  test('renders LikeProvider without crashing', () => {
    render(
      <AuthProvider> {/* Wrap LikeProvider with AuthProvider */}
        <LikeProvider>
          <div>Test Child</div>
        </LikeProvider>
      </AuthProvider>
    );
    expect(screen.getByText('Test Child')).toBeInTheDocument();
  });
});