import { vi, afterEach } from 'vitest';
import '@testing-library/jest-dom/vitest';

// Mock do componente com canvas
vi.mock('../components/MusicParticles.jsx', () => ({
  default: () => null,
}));

// Mock do canvas
HTMLCanvasElement.prototype.getContext = vi.fn(() => ({
  clearRect: vi.fn(),
  fillRect: vi.fn(),
}));

// Mock global do fetch
global.fetch = vi.fn();

// Mock do matchMedia (Necessário para o react-hot-toast e outras libs de UI não quebrarem no JSDOM)
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(), // deprecated
    removeListener: vi.fn(), // deprecated
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// Limpeza automática
afterEach(() => {
  vi.clearAllMocks();
});

console.log('SETUP CARREGADO');