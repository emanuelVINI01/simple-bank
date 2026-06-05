# Prompt For Sonnet: Build The Frontend Only

Voce e o agente responsavel apenas pela camada visual/frontend do app mobile Simple Bank. A camada de logica ja existe em `simple-bank-app/src` e deve ser usada como fonte unica para API, auth, hooks, i18n, formatacao, validacao, recibos e notificacoes.

Nao reimplemente a logica. Crie telas, componentes visuais, navegacao, NativeWind config e composicao do app.

## Objetivo

Implementar um app bancario nativo com Expo SDK 54, React Native, Expo Router, TypeScript e NativeWind. O resultado deve parecer um app mobile real inspirado em Nubank, Banco Inter, PicPay e PagBank, usando tema Dracula do Simple Bank. Nao pode parecer website, landing page, dashboard web ou webview.

## Leia Antes De Codar

Leia estes arquivos:

- `simple-bank-app/LOGIC_FRONTEND_BOUNDARY.md`
- `simple-bank-app/API_ROUTES.md`
- `simple-bank-app/src/index.ts`
- `simple-bank-app/src/api/types.ts`
- `simple-bank-app/src/hooks/use-auth.ts`
- `simple-bank-app/src/hooks/use-transfer.ts`
- `simple-bank-app/src/hooks/use-credit-notifications.ts`
- `simple-bank-app/src/i18n/dictionaries.ts`
- `simple-bank-app/src/theme/colors.ts`

Depois implemente somente UI e navegacao.

## Regras Inquebraveis

- Nao implemente `fetch` em tela/componente.
- Nao chame `/api/...` diretamente.
- Use os hooks prontos:
  - `useAuth`
  - `useWallet`
  - `usePaymentKeys`
  - `useCreatePaymentKey`
  - `useDeletePaymentKey`
  - `useCopyPaymentKey`
  - `useTransactions`
  - `useTransactionViewModel`
  - `useTransferFlow`
  - `useDownloadReceipt`
  - `useShareReceipt`
  - `useCreditNotifications`
- Use schemas prontos:
  - `loginSchema`
  - `registerSchema`
  - `resolveKeySchema`
  - `paymentSchema`
- Use formatadores prontos:
  - `formatMoney`
  - `formatDateTime`
  - `formatFullDate`
  - `formatShortReference`
  - `maskTaxId`
  - `maskEmail`
  - `getFirstName`
  - `getInitials`
- Use `useI18n().t(...)` para todos os textos. Se faltar texto, adicione chave em `src/i18n/dictionaries.ts`.
- Preserve Single Responsibility:
  - `app/` define rotas e compoe telas.
  - `src/components/ui` contem atomos visuais.
  - `src/components/forms` contem inputs e campos.
  - `src/components/home`, `keys`, `transactions`, `transfer` contem componentes especificos de tela.
  - Tela nao contem regras de API, storage, cookies, polling ou mappers.
- Nao coloque card dentro de card.
- Nao use dados mockados permanentes.
- Nao adicione marketing hero.
- Nao use SVG decorativo abstrato como experiencia principal.

## Setup Frontend Esperado

Complete ou ajuste:

```txt
simple-bank-app/
  app.json ou app.config.ts
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
  src/components/
  global.css
  metro.config.js
```

Use:

- Expo SDK 54.
- Expo Router.
- NativeWind.
- TanStack Query.
- React Hook Form.
- `@hookform/resolvers/zod`.
- `lucide-react-native`.
- `react-native-reanimated`.
- `react-native-safe-area-context`.
- Os pacotes de integracao ja declarados ou necessarios.

No `_layout.tsx`, configure:

```tsx
const queryClient = createBankQueryClient();

<QueryClientProvider client={queryClient}>
  <I18nProvider>
    <Slot />
  </I18nProvider>
</QueryClientProvider>
```

Tambem importe `global.css` no root.

## Tema Visual

Use os tokens de `src/theme/colors.ts`:

- Fundo: `#282a36`.
- Superficie profunda: `#21222c`.
- Card/surface: `#343746`, `#44475a`.
- Texto: `#f8f8f2`.
- Muted: `#a7b0c8`.
- Primario: `#bd93f9`.
- Sucesso/dinheiro recebido: `#50fa7b`.
- Link/ativo: `#8be9fd`.
- Saida/destaque secundario: `#ff79c6`.
- Alertas: `#ff5555`, `#ffb86c`, `#f1fa8c`.

Direcao:

- Home escura com topo roxo/Dracula, saldo grande e acoes rapidas.
- Grid de servicos como app bancario real.
- Bottom tabs com icones acima do label.
- Transferencia em fluxo nativo, com bottom sheets ou telas curtas.
- Extrato denso, agrupado por data.
- Componentes com raio 8 a 12.
- Sombras discretas, contraste limpo.
- Sem orbs, blobs, hero gradient ou cara de SaaS.
- Texto sempre cabendo em mobile pequeno.

## Componentes A Criar

### `src/components/ui`

- `Screen`: aplica safe area, background Dracula, opcao scroll/static.
- `PrimaryButton`: loading/disabled/icon.
- `IconButton`: icone lucide, tooltip nao necessario em mobile.
- `TextButton`.
- `Field`.
- `PasswordField`.
- `MoneyInput`.
- `StateView`: loading/error/empty.
- `SkeletonBlock`.
- `Badge`.
- `Avatar`.
- `Divider`.
- `ConfirmSheet`.

### `src/components/app`

- `AppHeader`: saudacao, avatar, sino, botao olho para saldo.
- `BottomTabBar` se precisar customizar Expo Tabs.
- `AuthenticatedShell`: chama `useAuth` e `useCreditNotifications`.

### `src/components/home`

- `BalancePanel`.
- `QuickActionRail`.
- `QuickAction`.
- `ServiceGrid`.
- `ServiceTile`.
- `LatestTransactions`.
- `AccountCardPreview`.

### `src/components/transfer`

- `ResolveKeyForm`.
- `ResolvedRecipientCard`.
- `PaymentAmountForm`.
- `TransferConfirm`.
- `TransferSuccess`.

### `src/components/keys`

- `PaymentKeyCard`.
- `PaymentKeyList`.
- `PaymentKeyLimitMeter`.

### `src/components/transactions`

- `TransactionRow`.
- `TransactionDateGroup`.
- `TransactionFilters`.
- `TransactionDetailPanel`.

## Rotas E Comportamentos

### `app/index.tsx`

- Verificar sessao com `hasStoredAuthSession()` ou `useAuth`.
- Redirecionar para `(tabs)/home` se autenticado.
- Redirecionar para `(auth)/login` se nao autenticado.
- Mostrar splash/loading simples enquanto decide.

### Login

Arquivo: `app/(auth)/login.tsx`

- Usar `useAuth().login`.
- Usar `loginSchema` com React Hook Form.
- Email e senha.
- CTA primario.
- Link para cadastro.
- Erro do hook exibido em `StateView`/mensagem compacta.
- Nao usar WebView.

### Cadastro

Arquivo: `app/(auth)/register.tsx`

- Usar `useAuth().register`.
- Usar `registerSchema`.
- Campos: nome, email, taxId numerico, senha.
- Cadastro faz login automatico porque o hook ja chama `registerAndLoginRequest`.
- Redirecionar para home no sucesso.

### Tabs

Arquivo: `app/(tabs)/_layout.tsx`

Tabs:

- Home: icone Home.
- Transferir: icone Send.
- Extrato: icone List/ReceiptText.
- Chaves: icone KeyRound.
- Perfil: icone User.

Use labels via i18n. Bottom bar fixa, respeitando safe area.

### Home

Arquivo: `app/(tabs)/home.tsx`

Use:

- `useAuth`
- `useWallet`
- `useTransactions({ limit: 10 })`
- `useTransactionViewModel`

Conteudo:

- Header: "Ola, {firstName}", avatar/monograma.
- Saldo em conta com ocultar/exibir.
- Acoes rapidas horizontais:
  - Transferir -> `/transfer`
  - Receber -> `/keys`
  - Copiar chave -> se houver primeira chave, `useCopyPaymentKey`; se nao houver, navegar keys.
  - Comprovantes -> `/transactions`
  - Mais -> abre grid/servicos.
- Grid de servicos com itens reais:
  - Pix/Transferir
  - Minhas chaves
  - Extrato
  - Gerar comprovante
  - Perfil
  - Ajuda demo
- Ultimas transacoes com `TransactionRow`.
- Pull-to-refresh invalidando queries.

### Transferir

Arquivo: `app/(tabs)/transfer.tsx`

Use `useTransferFlow`.

Fluxo:

1. `resolve-key`: form com `resolveKeySchema`.
2. `payment-data`: destinatario resolvido + valor/descricao com `paymentSchema`.
3. `confirm`: resumo final com destinatario, valor, descricao e referencia curta da idempotency key.
4. `success`: sucesso com botoes abrir/compartilhar comprovante e nova transferencia.

Regras visuais:

- Nao permitir confirmar sem destinatario e valor.
- Mostrar erro de saldo insuficiente, chave inexistente ou auto-pagamento.
- Botao de voltar etapa.
- Haptics ja estao nos hooks; nao duplique regra.

### Chaves

Arquivo: `app/(tabs)/keys.tsx`

Use:

- `usePaymentKeys`
- `useCreatePaymentKey`
- `useDeletePaymentKey`
- `useCopyPaymentKey`

Conteudo:

- Header com contador `n/10`.
- Botao criar chave.
- Lista de chaves.
- Cada card tem copiar, compartilhar se implementar share nativo, excluir com confirmacao.
- Empty state.
- Pull-to-refresh.

### Extrato

Arquivo: `app/(tabs)/transactions.tsx`

Use:

- `useAuth`
- `useTransactions`
- `useTransactionViewModel`

Conteudo:

- Filtros: todas, entradas, saidas.
- Busca local.
- Lista agrupada por data.
- `TransactionRow` navega para `/transaction/[id]`.
- Empty/loading/error states.

### Detalhe

Arquivo: `app/transaction/[id].tsx`

- Encontrar transacao em cache com `findTransactionById`.
- Se ausente, buscar `useTransactions({ limit: 100 })` e procurar.
- Mostrar ID, referencia, tipo, valor, data, pagador, recebedor, descricao.
- Copiar ID/referencia.
- Se `receiptUrl` existir, botao para `/receipt/[id]`.

### Comprovante

Arquivo: `app/receipt/[id].tsx`

Use:

- `useDownloadReceipt`
- `useShareReceipt`

Conteudo:

- Tela simples de comprovante.
- Botao baixar/abrir.
- Botao compartilhar.
- Erro 404 amigavel para transacao sem comprovante.

### Perfil

Arquivo: `app/(tabs)/profile.tsx`

Use:

- `useAuth`
- `maskTaxId`
- `maskEmail`

Conteudo:

- Nome, email mascarado, taxId mascarado.
- Saldo atual.
- Toggle ocultar saldo.
- Toggle notificacoes de recebimento. O hook `useCreditNotifications` deve ser acionado no shell autenticado usando esse estado.
- Intervalo de polling opcional.
- Botao sair chamando `logout`.

## Notificacoes

No shell autenticado ou layout de tabs:

```tsx
const auth = useAuth();
useCreditNotifications({
  enabled: notificationsEnabled && Boolean(auth.user),
  user: auth.user,
  onOpenTransaction: (transactionId) => router.push(`/transaction/${transactionId}`),
});
```

Nao prometa push remoto. A logica atual detecta creditos por polling e dispara notificacao local.

## Estados Obrigatorios

Cada tela de dados deve ter:

- Loading skeleton.
- Empty state.
- Error state com retry.
- Pull-to-refresh quando for lista/home.
- Disabled state em botoes pendentes.

## Responsividade Mobile

- Projetar primeiro para 360x780.
- Respeitar safe areas.
- Bottom tab nao pode cobrir conteudo.
- Textos de tiles devem quebrar linha corretamente.
- Inputs devem usar teclado adequado.
- Nao usar fonte escalada por largura da viewport.

## Validacao Final

Ao finalizar:

1. Rode `npm install` dentro de `simple-bank-app` se ainda nao houver dependencias.
2. Rode `npm run typecheck`.
3. Rode lint se configurado.
4. Rode `npx expo start`.
5. Verifique fluxo com dois usuarios:
   - cadastrar A;
   - criar chave A;
   - cadastrar B;
   - transferir de B para chave A;
   - abrir extrato de B;
   - abrir comprovante da saida;
   - logar A e confirmar credito recebido.

## Resultado Esperado

Um app Expo real, nativo, visualmente polido, sem logica duplicada, consumindo integralmente os hooks/services existentes e respeitando o tema Dracula.

