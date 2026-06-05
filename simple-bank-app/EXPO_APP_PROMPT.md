# Prompt: Simple Bank Mobile App

Voce e um agente senior de engenharia mobile. Crie um app completo com Expo + React Native usando Expo SDK 54, TypeScript, Expo Router e NativeWind. O app deve consumir a API existente do projeto Simple Bank, documentada em `simple-bank-app/API_ROUTES.md`, sem transformar a experiencia em website dentro de mobile.

## Contexto do Produto

O Simple Bank e um banco digital demo com:

- Cadastro e login por Auth.js Credentials.
- Sessao JWT em cookies HTTP.
- Conta com saldo em centavos.
- Chaves de pagamento UUID.
- Transferencias idempotentes entre usuarios.
- Extrato com lancamentos `DEBIT` e `CREDIT`.
- Geracao de comprovante PDF para debit transactions.

O app precisa parecer aplicativo bancario nativo brasileiro: mais proximo de Nubank, Banco Inter, PicPay e PagBank do que de dashboard web. Use as imagens de referencia fornecidas pelo usuario e as referencias atuais pesquisadas:

- Nubank no Google Play: conta, cartao, Pix, caixinhas, investimentos, emprestimos e experiencia simples.
- Inter no Google Play/site: super app financeiro com Pix, cartoes, investimentos, transferencias e grid de servicos.
- PicPay/PagBank: home com saldo, atalhos de Pix/QR/pagar, bottom nav, area de servicos, cards promocionais e extrato.

Nao copie marca, logo, textos comerciais ou assets dos bancos. Use a estrutura de produto e padroes de UX como inspiracao.

## Regras Obrigatorias de Arquitetura

Use os conceitos do `../dracula-repo-template/AGENTS.md`:

- Preserve o tema Dracula como base visual.
- Use tokens de tema, nao uma paleta paralela solta.
- Single Responsibility:
  - telas compoem;
  - componentes renderizam;
  - hooks controlam estado, efeitos e integracao;
  - services falam com API/Auth/storage;
  - mappers transformam dados para UI;
  - utils sao puros.
- Refatore quando uma tela ou componente misturar responsabilidades.
- Nao coloque fetch dentro de componente visual; use service + hook.
- Centralize repeticoes reais: cards, headers, loading/empty/error states, linhas de extrato, badges, formatadores, cores, status e arrays de navegacao.
- Todo texto de UI deve passar por i18n desde o inicio. Nao hardcode labels, CTAs, placeholders, mensagens de erro, loading, empty states, metadata textual ou toast.
- Crie `src/i18n` com dicionario tipado, inicialmente `pt-BR`, e consuma via hook/provider.
- Remova codigo morto, imports inuteis e assets padrao.
- Preserve comportamento da API; nao mude regras de negocio.

## Stack Obrigatoria

- Expo SDK 54.
- React Native + TypeScript.
- Expo Router para navegacao.
- NativeWind para estilos.
- TanStack Query para cache e sincronizacao.
- React Hook Form + Zod para formularios.
- `expo-secure-store` para dados sensiveis e cookies/tokens quando aplicavel.
- `expo-notifications` para notificacoes locais de recebimento de transferencia.
- `expo-file-system`, `expo-sharing` e/ou `expo-intent-launcher` quando necessario para abrir/compartilhar comprovantes PDF.
- `expo-clipboard` para copiar chaves.
- `expo-haptics` para feedback em acoes financeiras importantes.
- `lucide-react-native` para icones.
- `react-native-reanimated` para microinteracoes.
- `react-native-safe-area-context` e safe areas reais.

Observacoes atuais das docs:

- Expo SDK 54 tem documentacao versionada em `docs.expo.dev/versions/v54.0.0`.
- `expo-notifications` no SDK 54 suporta notificacoes locais e push, mas push remoto nao funciona no Expo Go no Android desde SDK 53; use development build para push remoto. Para este app, implemente notificacao local baseada em polling.
- NativeWind v5 e pre-release; se optar por v5 com SDK 54, siga a doc v5: `nativewind@preview`, `react-native-css`, Tailwind CSS v4, `withNativewind(config)` no Metro e sem `nativewind/babel`. Se priorizar estabilidade, use NativeWind v4 conforme compatibilidade do projeto, mas documente a escolha.

## Tema Visual

Crie uma identidade mobile Dracula bancaria:

```ts
const colors = {
  bg: "#282a36",
  surface: "#343746",
  card: "#44475a",
  surfaceDeep: "#21222c",
  fg: "#f8f8f2",
  muted: "#a7b0c8",
  cyan: "#8be9fd",
  purple: "#bd93f9",
  green: "#50fa7b",
  pink: "#ff79c6",
  red: "#ff5555",
  orange: "#ffb86c",
  yellow: "#f1fa8c"
};
```

Direcao visual:

- App nativo, vertical, com telas densas e escaneaveis.
- Fundo Dracula escuro, mas superficies com contraste limpo.
- Use roxo como assinatura da conta, verde para dinheiro recebido/sucesso, cyan para links/estados ativos e pink apenas como acento.
- Evite parecer landing page, SaaS dashboard ou webview.
- Bottom tab nativa fixa com icone acima do label.
- Home com header de saudacao, saldo, acoes rapidas horizontais, cards de conta/cartao, area de servicos e ultimas movimentacoes.
- Menus de servicos em grade, inspirados em PicPay/Inter, mas adaptados aos recursos reais da API.
- Modais/bottom sheets para transferir, confirmar, sucesso e comprovante.
- Cards com raio ate 8 ou 12 quando fizer sentido mobile. Nao use cards dentro de cards.
- Texto deve caber em botoes e tiles em telas pequenas.
- Use skeletons, empty states e error states com visual consistente.

## Estrutura de Pastas

Crie uma estrutura como:

```txt
simple-bank-app/
  app/
    _layout.tsx
    index.tsx
    (auth)/
      login.tsx
      register.tsx
    (tabs)/
      _layout.tsx
      home.tsx
      transfer.tsx
      transactions.tsx
      keys.tsx
      profile.tsx
    transaction/
      [id].tsx
    receipt/
      [id].tsx
  src/
    api/
      client.ts
      auth.ts
      banking.ts
      types.ts
    components/
      app/
      feedback/
      forms/
      home/
      keys/
      transactions/
      ui/
    hooks/
      use-auth.ts
      use-wallet.ts
      use-payment-keys.ts
      use-transactions.ts
      use-transfer.ts
      use-credit-notifications.ts
    i18n/
      dictionaries.ts
      provider.tsx
      types.ts
    lib/
      cookies.ts
      format.ts
      idempotency.ts
      notification-cursor.ts
      receipt.ts
      storage.ts
    theme/
      colors.ts
      nativewind.css
      tokens.ts
    mappers/
      transaction.ts
  global.css
  metro.config.js
  package.json
```

## API Integration

Use uma variavel:

```env
EXPO_PUBLIC_API_URL=http://localhost:3000
```

Para Android emulator, documente que `localhost` pode precisar virar `http://10.0.2.2:3000`. Para device fisico, usar IP da maquina na rede local.

Implemente um `api/client.ts` com:

- `baseUrl` por env.
- `requestJson<T>()`.
- Tratamento de erro `message` ou `error`.
- Inclusao de cookies da sessao Auth.js em toda requisicao protegida.
- Captura de `Set-Cookie` quando o servidor responder login/session/signout.
- Timeout e retry apenas para GETs seguros.
- Nunca logar senha, cookie de sessao ou payload sensivel.

### Auth.js Native Flow

Implemente:

1. `GET /api/auth/csrf`.
2. Armazene cookies retornados.
3. `POST /api/auth/callback/credentials` com `csrfToken`, `email`, `password`, `redirect=false`, `json=true`.
4. Armazene cookies retornados.
5. Chame `GET /api/users/me`.
6. Se `401`, limpe sessao local e mande para login.

Cadastro:

- `POST /api/auth/register`.
- Depois do cadastro bem-sucedido, faca login automatico com as credenciais informadas.

Logout:

- Chame endpoint Auth.js de signout se necessario.
- Limpe cookies/storage/query cache.
- Volte para login.

## Telas Obrigatorias

### Login

- Visual nativo, simples, sem hero web.
- Logo textual "Simple Bank" ou monograma local.
- Campos email/senha com validacao.
- CTA entrar.
- Link para cadastro.
- Estados loading/error.
- Biometria opcional depois do primeiro login, se implementar com seguranca.

### Cadastro

- Nome, email, taxId de 8 digitos, senha.
- Validacao com Zod igual ao backend.
- Mostrar erros por campo via i18n.
- Login automatico depois de cadastrar.

### Home

Conteudo:

- Header com saudacao por primeiro nome, avatar circular/monograma, sino de notificacoes e botao de ocultar saldo.
- Card/area de saldo com valor em BRL, estado oculto, atalho para extrato.
- Acoes rapidas horizontais:
  - Pix/Transferir.
  - Receber.
  - Copiar chave.
  - Comprovantes.
  - Mais.
- Grade de servicos:
  - Transferir.
  - Minhas chaves.
  - Extrato.
  - Gerar comprovante.
  - Perfil.
  - Ajuda/limites demo.
- Ultimas movimentacoes com 3 a 5 itens.
- Pull-to-refresh.
- Skeleton enquanto carrega.

### Transferir

Fluxo em etapas nativas, preferencialmente bottom sheet ou stack:

1. Inserir chave de pagamento.
2. Resolver chave via `GET /api/payment-keys/:key`.
3. Mostrar destinatario, email mascarado/taxId mascarado, confirmar que nao e o proprio usuario.
4. Informar valor em centavos/BRL com mascara monetaria e descricao opcional.
5. Confirmar resumo: destinatario, valor, descricao, idempotency key.
6. Criar pagamento com `POST /api/payments` e header `Idempotency-Key`.
7. Tela de sucesso com comprovante.

Regras:

- Sempre gere `idempotencyKey` UUID ao entrar na etapa de pagamento.
- Mantenha o mesmo idempotency key em retries da mesma tentativa.
- Se a tentativa for cancelada e reiniciada, gere nova chave.
- Ao sucesso, invalide `me`, `transactions`, `paymentKeys`.
- Ofereca abrir/compartilhar comprovante PDF.

### Receber / Chaves

Tela `keys.tsx`:

- Listar chaves do usuario.
- Criar chave via `POST /api/payment-keys`.
- Limite visual: max 10 chaves.
- Copiar chave com `expo-clipboard`.
- Compartilhar chave.
- Deletar chave com confirmacao.
- Mostrar QR visual local com a chave em texto/QR se instalar biblioteca de QR; caso contrario, tile copiavel.

### Extrato

- Lista agrupada por data.
- Filtros locais: todos, entradas, saidas.
- Busca local por nome, email, descricao ou referencia.
- Linha de transacao:
  - icone direcional;
  - nome da contraparte;
  - descricao curta;
  - valor verde para credit, vermelho/pink para debit;
  - data/hora;
  - badge de tipo.
- Ao tocar, abrir detalhe.
- Pull-to-refresh.
- Empty state quando nao houver transacoes.

### Detalhe da Transacao

- Mostre tudo que a API retorna:
  - ID;
  - referenceId;
  - tipo;
  - valor;
  - data;
  - pagador;
  - recebedor;
  - descricao.
- Para debit com `receiptUrl`, botao "Abrir comprovante".
- Botao copiar ID/referencia.

### Comprovante

- Baixar PDF autenticado via `GET /api/transactions/:id/receipt`.
- Salvar em cache/document directory.
- Abrir ou compartilhar.
- Tratar `404` para credit transaction ou transacao de outro usuario.
- Mostrar estado de loading e erro.

### Perfil

- Dados do usuario atual.
- Saldo atual.
- Tax ID mascarado.
- Configuracoes:
  - ocultar saldo;
  - notificacoes de recebimento;
  - intervalo de atualizacao;
  - sair.

## Notificacao ao Receber Transferencia

A API atual nao tem websocket, SSE, push remoto ou endpoint de device token. Portanto, implemente um mecanismo realista usando a mesma API:

- Hook `useCreditNotifications`.
- Rodar apenas autenticado e quando usuario habilitar notificacoes.
- Solicitar permissao com `expo-notifications`.
- Ao entrar no app e em intervalos de 15 a 30 segundos no foreground, chamar `GET /api/users/transactions?limit=25`.
- Persistir cursor local:
  - `lastSeenTransactionId`;
  - `lastSeenCreatedAt`;
  - `initialized`.
- Na primeira execucao depois do login, apenas inicializar cursor para nao disparar notificacoes antigas.
- Nas proximas execucoes, detectar novas transacoes `type === "CREDIT"` com `createdAt` maior que o cursor.
- Para cada credito novo, agendar notificacao local:
  - titulo: "Transferencia recebida";
  - corpo: "Voce recebeu R$ X de NOME";
  - data: `{ transactionId }`.
- Ao tocar na notificacao, navegar para `/transaction/[id]`.
- Depois de detectar credito, invalidar queries `me` e `transactions`.
- Pausar polling em logout e limpar cursor ao trocar de usuario.

Nao prometa push em segundo plano/killed app sem backend novo. Adicione comentario tecnico dizendo que push remoto exigiria salvar Expo push token no backend e disparar apos `creditReceiver`.

## NativeWind Setup

Crie `global.css` com tokens Dracula. Se usar NativeWind v5:

```css
@import "tailwindcss/theme.css" layer(theme);
@import "tailwindcss/preflight.css" layer(base);
@import "tailwindcss/utilities.css";
@import "nativewind/theme";

@theme {
  --color-dracula-bg: #282a36;
  --color-dracula-surface: #343746;
  --color-dracula-card: #44475a;
  --color-dracula-deep: #21222c;
  --color-dracula-fg: #f8f8f2;
  --color-dracula-muted: #a7b0c8;
  --color-dracula-cyan: #8be9fd;
  --color-dracula-purple: #bd93f9;
  --color-dracula-green: #50fa7b;
  --color-dracula-pink: #ff79c6;
  --color-dracula-red: #ff5555;
  --color-dracula-orange: #ffb86c;
  --color-dracula-yellow: #f1fa8c;
}
```

Use `metro.config.js` com `withNativewind(config)`.

## Componentes Base

Crie componentes pequenos e reutilizaveis:

- `Screen`: safe area, background, scroll/static variants.
- `AppTopBar`: saudacao, avatar, action icons.
- `BottomTabIcon`.
- `BalancePanel`.
- `QuickAction`.
- `ServiceTile`.
- `MoneyText`.
- `TransactionRow`.
- `TransactionDateGroup`.
- `PaymentKeyCard`.
- `PrimaryButton`, `IconButton`, `TextButton`.
- `Field`, `PasswordField`, `MoneyInput`.
- `StateView` para loading/error/empty.
- `ConfirmSheet`.
- `ReceiptActions`.

## Dados, Formatacao e Mappers

Implemente utils:

- `formatMoney(cents: number): string` em `pt-BR`, `BRL`.
- `formatDateTime(iso: string)`.
- `maskTaxId(taxId: string)`.
- `maskEmail(email: string)`.
- `getCounterparty(transaction, currentUserId)`.
- `mapTransactionToListItem`.
- `summarizeTransactions`: recebidos, enviados, total, ultimo movimento.

## Qualidade de UX

- Acoes financeiras precisam de feedback haptico.
- Use pull-to-refresh nas telas de Home, Extrato e Chaves.
- Use optimistic UI apenas onde for seguro; pagamento deve esperar confirmacao do backend.
- Use estados offline/erro de rede com retry.
- Nao bloqueie a tela inteira se apenas uma area estiver recarregando.
- Inputs devem ter teclado correto:
  - email: `email-address`;
  - taxId: numeric;
  - valor: decimal/numeric conforme mascara.
- Respeite `prefers-reduced-motion`/config do sistema quando possivel.
- Use safe area no topo e bottom nav.

## Segurança

- Nunca salve senha.
- Cookies/Auth.js devem ficar em storage seguro quando possivel.
- Limpe storage no logout.
- Mascarar taxId e email em telas de confirmacao quando fizer sentido.
- Nao mostrar saldo se usuario ativou ocultar saldo.
- Nao enviar pagamento sem tela de confirmacao.
- Nao usar WebView para login.

## Criterios de Aceite

- App inicia em login quando nao autenticado.
- Cadastro cria usuario e autentica.
- Login Auth.js funciona contra a API existente.
- Home mostra saldo real e ultimas transacoes.
- Criacao/listagem/copia/remocao de chaves funciona.
- Transferencia completa funciona entre dois usuarios.
- Idempotency key e enviada no header.
- Extrato atualiza apos transferencia.
- Comprovante PDF abre/compartilha para debit transactions.
- Recebimento de transferencia dispara notificacao local em foreground/resume apos polling detectar novo `CREDIT`.
- Logout limpa sessao e cache.
- Todas as strings passam por i18n.
- `npm run lint`, typecheck e o app Expo rodam sem erros.

## Entrega Esperada

Implemente o app dentro de `simple-bank-app/` como projeto Expo real. Nao entregue apenas telas mockadas. Use a API do banco como fonte de verdade. Quando precisar de dados enquanto a API carrega, use skeletons e empty states, nao dados falsos permanentes.

Depois de implementar:

1. Rode install com versoes compativeis com Expo SDK 54.
2. Rode lint/typecheck.
3. Rode `npx expo start`.
4. Documente no README do app:
   - como configurar `EXPO_PUBLIC_API_URL`;
   - como usar Android emulator/device fisico;
   - limitacao da notificacao por polling;
   - fluxo de criar dois usuarios para testar transferencia.

