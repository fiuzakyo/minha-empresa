# `@futuredata/ui-react`

Os componentes do Voltron para **React sem Tailwind**: um pacote npm + um arquivo CSS pronto.

## Instalação

```bash
npm i @futuredata/ui-react
```

Importe o CSS uma vez (no entry da aplicação ou no layout raiz):

```ts
import "@futuredata/ui-react/styles.css"
```

## Uso

```tsx
import { Button, Alert, Tabs, TabsList, TabsTrigger, TabsContent } from "@futuredata/ui-react"

export function Exemplo() {
  return (
    <div data-brand="detetive-auto">
      <Alert status="success" title="Pagamento confirmado" onDismiss={() => {}}>Recibo enviado por e-mail.</Alert>
      <Button variant="outline">Ver detalhes</Button>
    </div>
  )
}
```

A API é idêntica à de `@futuredata/ui-tailwind` e à do registro shadcn.

## Como funciona

O CSS é gerado a partir do mesmo código-fonte dos outros pacotes. As classes internas dos componentes recebem o
prefixo `fd:` (`fd:bg-primary`), por isso:

- o projeto **não precisa** de Tailwind;
- o CSS **não colide** com as classes do projeto (nem com um Tailwind que o projeto já use);
- não há reset global: só um reset mínimo dentro dos componentes (`[data-slot]`).

Para customizar, passe `className` (suas classes passam intactas) ou sobrescreva as variáveis CSS dos tokens
(`--primary`, `--vt-radius-button`, `--vt-font-family-text`…).

## Desenvolvimento

`npm run build` gera `.generated/` (código com as classes prefixadas), confere que nenhuma classe ficou sem prefixo,
compila o JS/tipos com tsup e o CSS com o Tailwind. Não edite `.generated/` — a fonte é
`../shadcn/registry/futuredata/`.
