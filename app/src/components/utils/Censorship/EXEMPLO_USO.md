# Sistema de Censura - Guia de Uso

Este sistema permite censurar textos e imagens baseado em configurações salvas no localStorage.

## Configuração

O `CensorshipProvider` já está configurado no `root.tsx`, então você pode usar os componentes diretamente.

## Componentes Disponíveis

### 1. TextCensored

Censura textos substituindo por estrelas (`*`).

```tsx
import { TextCensored } from "~/src/components/utils/Censorship";

// Uso básico
<TextCensored censorshipKey="texto-sensivel">
  Este texto será censurado se a chave estiver ativa
</TextCensored>

// Com replacement customizado
<TextCensored
  censorshipKey="texto-sensivel"
  replacement="●"
>
  Este texto será substituído por círculos
</TextCensored>
```

### 2. ImageCensored

Censura imagens aplicando blur.

```tsx
import { ImageCensored } from "~/src/components/utils/Censorship";

// Uso básico
<ImageCensored
  censorshipKey="imagem-sensivel"
  src="/path/to/image.jpg"
  alt="Imagem"
/>

// Com blur customizado
<ImageCensored
  censorshipKey="imagem-sensivel"
  src="/path/to/image.jpg"
  alt="Imagem"
  blurIntensity={20} // padrão é 10px
/>
```

### 3. CensorshipWrapper

Wrapper que pode processar elementos filhos e aplicar censura automaticamente.

```tsx
import { CensorshipWrapper } from "~/src/components/utils/Censorship";

<CensorshipWrapper>
  <TextCensored censorshipKey="texto-1">Texto que será censurado</TextCensored>
  <ImageCensored censorshipKey="imagem-1" src="/image.jpg" alt="Imagem" />
</CensorshipWrapper>;
```

## Gerenciando Configurações de Censura

Use o hook `useCensorship` para gerenciar as configurações:

```tsx
import { useCensorship } from "~/src/components/utils/Censorship";

function MeuComponente() {
  const { isCensored, toggleCensorship, setCensorship, settings, clearAll } =
    useCensorship();

  // Verificar se uma chave está censurada
  const censurado = isCensored("texto-sensivel");

  // Alternar censura de uma chave
  const handleToggle = () => {
    toggleCensorship("texto-sensivel");
  };

  // Definir censura explicitamente
  const handleSet = (value: boolean) => {
    setCensorship("texto-sensivel", value);
  };

  // Ver todas as configurações
  console.log(settings); // { "texto-sensivel": true, "imagem-1": false }

  // Limpar todas as configurações
  const handleClear = () => {
    clearAll();
  };

  return (
    <div>
      <button onClick={handleToggle}>
        {censurado ? "Mostrar" : "Censurar"}
      </button>
      <TextCensored censorshipKey="texto-sensivel">Texto sensível</TextCensored>
    </div>
  );
}
```

## Exemplo Completo

```tsx
import {
  TextCensored,
  ImageCensored,
  useCensorship,
} from "~/src/components/utils/Censorship";

function ExemploCompleto() {
  const { toggleCensorship, isCensored } = useCensorship();

  return (
    <div>
      <h1>Exemplo de Censura</h1>

      <div>
        <button onClick={() => toggleCensorship("nome")}>
          {isCensored("nome") ? "Mostrar Nome" : "Censurar Nome"}
        </button>
        <TextCensored censorshipKey="nome">João Silva</TextCensored>
      </div>

      <div>
        <button onClick={() => toggleCensorship("foto")}>
          {isCensored("foto") ? "Mostrar Foto" : "Censurar Foto"}
        </button>
        <ImageCensored
          censorshipKey="foto"
          src="/foto.jpg"
          alt="Foto do usuário"
          blurIntensity={15}
        />
      </div>
    </div>
  );
}
```

## Notas Importantes

1. As configurações são salvas automaticamente no localStorage com a chave `beergam_censorship_settings`
2. Cada `censorshipKey` é independente - você pode censurar múltiplos itens separadamente
3. O estado persiste entre sessões do navegador
4. Use chaves descritivas e únicas para cada item que deseja censurar
