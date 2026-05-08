import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { TripForm } from './TripForm';

describe('TripForm', () => {
  const mockOnSubmit = vi.fn();

  it('renders correctly', () => {
    render(<TripForm onSubmit={mockOnSubmit} isLoading={false} />);
    expect(screen.getByLabelText(/Origin/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Destination/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Plan Trip/i })).toBeInTheDocument();
  });

  it('calls onSubmit with form data', () => {
    render(<TripForm onSubmit={mockOnSubmit} isLoading={false} />);
    
    fireEvent.change(screen.getByLabelText(/Origin/i), { target: { value: 'Mumbai' } });
    fireEvent.change(screen.getByLabelText(/Destination/i), { target: { value: 'Goa' } });
    fireEvent.change(screen.getByLabelText(/Duration/i), { target: { value: '5' } });
    fireEvent.change(screen.getByLabelText(/Travelers/i), { target: { value: '4' } });
    
    fireEvent.click(screen.getByRole('button', { name: /Plan Trip/i }));
    
    expect(mockOnSubmit).toHaveBeenCalledWith(expect.objectContaining({
      origin: 'Mumbai',
      destination: 'Goa',
      duration: 5,
      travelers: 4,
    }));
  });

  it('disables submit button when loading', () => {
    render(<TripForm onSubmit={mockOnSubmit} isLoading={true} />);
    expect(screen.getByRole('button', { name: /Crafting Itinerary/i })).toBeDisabled();
  });

  it('validates required fields', () => {
    render(<TripForm onSubmit={mockOnSubmit} isLoading={false} />);
    const submitButton = screen.getByRole('button', { name: /Plan Trip/i });
    expect(submitButton).toBeDisabled();
    
    fireEvent.change(screen.getByLabelText(/Origin/i), { target: { value: 'Mumbai' } });
    expect(submitButton).toBeDisabled();
    
    fireEvent.change(screen.getByLabelText(/Destination/i), { target: { value: 'Goa' } });
    expect(submitButton).not.toBeDisabled();
  });
});
