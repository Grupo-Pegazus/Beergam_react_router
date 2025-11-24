declare module "react-simple-maps" {
  import { ReactNode, ComponentType } from "react";

  export interface GeographyFeature {
    rsmKey?: string;
    id?: string;
    properties?: Record<string, unknown>;
  }

  export interface GeographiesRenderProps {
    geographies: GeographyFeature[] | Record<string, GeographyFeature>;
  }

  export interface ComposableMapProps {
    projection?: string;
    projectionConfig?: {
      center?: [number, number];
      scale?: number;
      [key: string]: unknown;
    };
    style?: React.CSSProperties;
    children?: ReactNode;
  }

  export interface GeographyProps {
    geography: GeographyFeature;
    fill?: string;
    stroke?: string;
    strokeWidth?: number;
    style?: {
      default?: React.CSSProperties;
      hover?: React.CSSProperties;
      pressed?: React.CSSProperties;
    };
    onMouseEnter?: () => void;
    onMouseLeave?: () => void;
    "data-tooltip-id"?: string;
    "data-tooltip-html"?: string;
    key?: string;
  }

  export const ComposableMap: ComponentType<ComposableMapProps>;
  export const Geographies: ComponentType<{
    geography: string | object;
    children: (props: GeographiesRenderProps) => ReactNode;
  }>;
  export const Geography: ComponentType<GeographyProps>;
}

