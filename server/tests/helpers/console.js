/**
 * tests/helpers/console.js
 *
 * Fornece um mecanismo seguro para lidar com console.error em testes.
 *
 * Estratégia:
 * - Por padrão, NÃO há silenciamento global.
 * - Cada teste que produz console.error de forma ESPERADA deve optar-in
 *   usando `suppressExpectedConsoleError()` dentro de um bloco beforeEach/afterEach.
 * - Qualquer console.error inesperado não é suprimido, permanecendo visível.
 *
 * Uso:
 *   const { suppressExpectedConsoleError } = require('./helpers/console');
 *
 *   describe('meu grupo', () => {
 *     suppressExpectedConsoleError(); // Suprime apenas dentro deste bloco
 *
 *     it('deve retornar 500 em DB failure', async () => { ... });
 *   });
 */

/**
 * Instala um spy em console.error que suprime a saída para o terminal,
 * sem esconder o fato de que o erro ocorreu.
 *
 * Deve ser chamado dentro de um bloco `describe`. Automaticamente:
 * - Instala o spy no beforeEach
 * - Restaura o spy original no afterEach
 *
 * Isso garante que cada teste receba um spy limpo e que erros
 * inesperados em testes fora deste bloco permaneçam visíveis.
 */
function suppressExpectedConsoleError() {
  let spy;

  beforeEach(() => {
    spy = jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    spy.mockRestore();
  });
}

module.exports = { suppressExpectedConsoleError };
