/* eslint-disable react/prop-types */
import {
  type ReactElement,
  type ReactNode,
  cloneElement,
  isValidElement,
  useMemo,
} from "react";
import Svg from "~/src/assets/svgs/_index";
import { useCensorship } from "./CensorshipContext";
import { ImageCensored } from "./ImageCensored";
import { TextCensored } from "./TextCensored";
import { type TPREDEFINED_CENSORSHIP_KEYS } from "./typings";
interface CensorshipWrapperProps {
  children: ReactNode;
  className?: string;
  censorshipKey: TPREDEFINED_CENSORSHIP_KEYS; // Chave única para controlar a censura do wrapper
  controlChildren?: boolean; // Se true, controla todas as chaves que começam com censorshipKey
}

/**
 * Wrapper que detecta componentes text_censored e image_censored
 * e aplica censura baseado nas configurações do localStorage.
 * Possui um botão de olho no canto superior direito para controlar a censura.
 *
 * @param controlChildren - Se true, ao fazer toggle, controla todas as chaves
 * que começam com o prefixo da censorshipKey (ex: se a key for "home_summary",
 * controla "home_summary_liquido", "home_summary_bruto", etc.).
 * O wrapper funciona como um estado global independente dos filhos.
 */
export function CensorshipWrapper({
  children,
  className,
  censorshipKey,
  controlChildren = false,
}: CensorshipWrapperProps) {
  const { isCensored, toggleCensorship, setCensorship, settings } =
    useCensorship();
  const wrapperCensored = isCensored(censorshipKey);

  const processChildren = (node: ReactNode): ReactNode => {
    if (!isValidElement(node)) {
      return node;
    }

    const element = node as ReactElement;

    // Verifica se é um componente TextCensored
    if (element.type === TextCensored) {
      return (
        <TextCensored
          key={element.key}
          {...(element.props as React.ComponentProps<typeof TextCensored>)}
          // Força a censura se o wrapper estiver censurado
          forceCensor={wrapperCensored}
        />
      );
    }

    // Verifica se é um componente ImageCensored
    if (element.type === ImageCensored) {
      return (
        <ImageCensored
          key={element.key}
          {...(element.props as React.ComponentProps<typeof ImageCensored>)}
          // Força a censura se o wrapper estiver censurado
          forceCensor={wrapperCensored}
        />
      );
    }

    // Verifica se tem data-censorship-key (para uso com elementos HTML nativos)
    const props = element.props as {
      "data-censorship-key"?: string;
      "data-censorship-type"?: "text" | "image";
      children?: ReactNode;
      className?: string;
      src?: string;
      alt?: string;
      "data-replacement"?: string;
      "data-blur-intensity"?: number | string;
      [key: string]: unknown;
    };

    if (props["data-censorship-key"]) {
      const censorshipKey = props["data-censorship-key"];
      const censorshipType = props["data-censorship-type"] || "text";

      if (censorshipType === "text") {
        return (
          <TextCensored
            key={element.key}
            censorshipKey={censorshipKey as TPREDEFINED_CENSORSHIP_KEYS}
            className={
              typeof props.className === "string" ? props.className : undefined
            }
            replacement={
              typeof props["data-replacement"] === "string"
                ? props["data-replacement"]
                : undefined
            }
            forceCensor={wrapperCensored}
          >
            {props.children || element}
          </TextCensored>
        );
      }

      if (censorshipType === "image") {
        const src = typeof props.src === "string" ? props.src : undefined;
        const alt = typeof props.alt === "string" ? props.alt : undefined;
        const imgClassName =
          typeof props.className === "string" ? props.className : undefined;
        return (
          <ImageCensored
            key={element.key}
            censorshipKey={censorshipKey}
            src={src}
            alt={alt}
            className={imgClassName}
            blurIntensity={
              props["data-blur-intensity"]
                ? Number(props["data-blur-intensity"])
                : undefined
            }
            forceCensor={wrapperCensored}
          />
        );
      }
    }

    // Se o elemento tem filhos, processa recursivamente
    const elementProps = element.props as {
      children?: ReactNode;
      [key: string]: unknown;
    };
    if (elementProps && elementProps.children) {
      return cloneElement(
        element,
        element.props as Record<string, unknown>,
        Array.isArray(elementProps.children)
          ? elementProps.children.map(processChildren)
          : processChildren(elementProps.children)
      );
    }

    return element;
  };

  const processedChildren = useMemo(() => {
    return Array.isArray(children)
      ? children.map(processChildren)
      : processChildren(children);
  }, [children, wrapperCensored]);

  const handleToggle = () => {
    if (controlChildren) {
      // Determina o novo valor (inverso do atual)
      const newValue = !wrapperCensored;

      // Atualiza a chave do wrapper
      setCensorship(censorshipKey, newValue);

      // Encontra todas as chaves que começam com o prefixo do wrapper
      // e atualiza todas para o mesmo valor
      const prefix = `${censorshipKey}_`;
      Object.keys(settings).forEach((key) => {
        if (key.startsWith(prefix)) {
          setCensorship(key, newValue);
        }
      });
    } else {
      // Comportamento padrão: apenas toggle da chave do wrapper
      toggleCensorship(censorshipKey);
    }
  };

  return (
    <div className={`relative ${className || ""}`}>
      {/* Botão de toggle no canto superior direito */}
      <button
        type="button"
        onClick={handleToggle}
        className="absolute group -top-4 -right-2 z-10 p-1.5 rounded-full bg-white shadow-md transition-colors duration-200 flex items-center justify-center hover:translate-y-px hover:bg-beergam-blue-primary hover:text-beergam-white!"
        aria-label={wrapperCensored ? "Mostrar conteúdo" : "Censurar conteúdo"}
        title={wrapperCensored ? "Mostrar conteúdo" : "Censurar conteúdo"}
      >
        {wrapperCensored ? (
          <Svg.eye_slash
            width={20}
            height={20}
            tailWindClasses="text-gray-700 group-hover:text-beergam-white!"
          />
        ) : (
          <Svg.eye
            width={20}
            height={20}
            tailWindClasses="text-gray-700 group-hover:text-beergam-white!"
          />
        )}
      </button>
      {processedChildren}
    </div>
  );
}

// Componentes auxiliares para uso mais fácil
export const text_censored = TextCensored;
export const image_censored = ImageCensored;
