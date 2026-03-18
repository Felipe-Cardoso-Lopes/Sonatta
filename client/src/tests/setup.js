import { vi, afterEach } from 'vitest';

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

// Limpeza automática
afterEach(() => {
  vi.clearAllMocks();
});