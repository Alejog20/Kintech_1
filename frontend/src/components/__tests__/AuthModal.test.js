import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import AuthModal from '../AuthModal';
import { AuthProvider } from '../../context/AuthContext';
import { LanguageProvider } from '../../context/LanguageContext';

import { rest } from 'msw';
import { setupServer } from 'msw/node';
import { API_CONFIG } from '../../config/api';

const server = setupServer(
  rest.post(`${API_CONFIG.AUTH_API}/api/auth/login`, (req, res, ctx) => {
    const { email, password } = req.body;
    if (email === 'test@example.com' && password === 'password') {
      return res(ctx.json({ access_token: 'mock-jwt-token' }));
    }
    return res(ctx.status(401), ctx.json({ error: 'Error al iniciar sesión' }));
  }),

  rest.post(`${API_CONFIG.AUTH_API}/api/auth/register`, (req, res, ctx) => {
    const { name, email, password } = req.body;
    if (email === 'existing@example.com') {
      return res(ctx.status(409), ctx.json({ error: 'Error al registrarse' }));
    }
    if (!name || !email || !password) {
      return res(ctx.status(400), ctx.json({ error: 'Este campo es obligatorio' }));
    }
    return res(ctx.status(201), ctx.json({ message: '¡Registro exitoso! Ahora puedes iniciar sesión.' }));
  })
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe('AuthModal', () => {
  const onClose = jest.fn();

  const renderComponent = (initialTab = 'login') => {
    return render(
      <LanguageProvider>
        <AuthProvider>
          <AuthModal isOpen={true} onClose={onClose} initialTab={initialTab} />
        </AuthProvider>
      </LanguageProvider>
    );
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('renders login form by default', () => {
    renderComponent();
    expect(screen.getByRole('button', { name: 'Iniciar Sesión', selector: '.auth-tab' })).toBeInTheDocument();
    expect(screen.getByLabelText('Correo Electrónico')).toBeInTheDocument();
    expect(screen.getByLabelText('Contraseña')).toBeInTheDocument();
  });

  test('switches to register tab', () => {
    renderComponent();
    fireEvent.click(screen.getByText('Registrarse'));
    expect(screen.getByLabelText('Nombre')).toBeInTheDocument();
  });

  test('shows error on failed login', async () => {
    renderComponent();
    fireEvent.change(screen.getByLabelText('Correo Electrónico'), { target: { value: 'wrong@example.com' } });
    fireEvent.change(screen.getByLabelText('Contraseña'), { target: { value: 'wrong' } });
    fireEvent.click(screen.getByRole('button', { name: 'Iniciar Sesión' }));

    await waitFor(() => {
      expect(screen.getByText('Error al iniciar sesión')).toBeInTheDocument();
    });
  });

  test('calls onClose on successful login', async () => {
    renderComponent();
    fireEvent.change(screen.getByLabelText('Correo Electrónico'), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText('Contraseña'), { target: { value: 'password' } });
    fireEvent.click(screen.getByRole('button', { name: 'Iniciar Sesión' }));

    await waitFor(() => {
      expect(onClose).toHaveBeenCalledTimes(1);
    });
  });

  test('shows success message on successful registration', async () => {
    renderComponent('register');
    fireEvent.change(screen.getByLabelText('Nombre'), { target: { value: 'Test User' } });
    fireEvent.change(screen.getByLabelText('Correo Electrónico'), { target: { value: 'new@example.com' } });
    fireEvent.change(screen.getByLabelText('Contraseña'), { target: { value: 'password' } });
    fireEvent.click(screen.getByRole('button', { name: 'Registrarse' }));

    await waitFor(() => {
      expect(screen.getByText('¡Registro exitoso! Ahora puedes iniciar sesión.')).toBeInTheDocument();
    });
  });

  test('shows error on failed registration', async () => {
    renderComponent('register');
    fireEvent.change(screen.getByLabelText('Nombre'), { target: { value: 'Test User' } });
    fireEvent.change(screen.getByLabelText('Correo Electrónico'), { target: { value: 'existing@example.com' } });
    fireEvent.change(screen.getByLabelText('Contraseña'), { target: { value: 'password' } });
    fireEvent.click(screen.getByRole('button', { name: 'Registrarse' }));

    await waitFor(() => {
      expect(screen.getByText('Error al registrarse')).toBeInTheDocument();
    });
  });

  test('validates form fields', async () => {
    renderComponent('register');
    fireEvent.click(screen.getByRole('button', { name: 'Registrarse' }));
    await waitFor(() => {
        expect(screen.getByText('Este campo es obligatorio')).toBeInTheDocument();
    });

    fireEvent.change(screen.getByLabelText('Nombre'), { target: { value: 'Test' } });
    fireEvent.change(screen.getByLabelText('Correo Electrónico'), { target: { value: 'not-an-email' } });
    fireEvent.click(screen.getByRole('button', { name: 'Registrarse' }));
    await waitFor(() => {
        expect(screen.getByText('Por favor ingresa un email válido')).toBeInTheDocument();
    });

    fireEvent.change(screen.getByLabelText('Correo Electrónico'), { target: { value: 'test@test.com' } });
    fireEvent.change(screen.getByLabelText('Contraseña'), { target: { value: '123' } });
    fireEvent.click(screen.getByRole('button', { name: 'Registrarse' }));
    await waitFor(() => {
        expect(screen.getByText('La contraseña debe tener al menos 6 caracteres')).toBeInTheDocument();
    });
  });
});