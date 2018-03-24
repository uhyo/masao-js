export interface MasaoJSONFormat {
  'masao-json-format-version': MasaoJSONFormatVersion;
  params: Record<string, string>;
  version: string;
  metadata?: {
    title?: string;
    author?: string;
    editor?: string;
  };
  script?: string;
  'advanced-map'?: AdvancedMap;
}
export type MasaoJSONFormatVersion =
  | 'draft-1'
  | 'draft-2'
  | 'draft-3'
  | 'draft-4';
export interface AdvancedMap {
  stages: Array<StageObject>;
  customParts?: Record<
    string,
    {
      extends: string;
      properties: Record<string, any>;
    }
  >;
}
export interface StageObject {
  size: {
    x: number;
    y: number;
  };
  layers: Array<LayerObject>;
}
export interface LayerObject {
  id?: string;
  type: 'main' | 'mapchip';
  src?: string;
  map: Array<Array<number | string>>;
}

//formatのversionを数字に
export function formatVersionToNumber(version: string): number {
  if (version === 'draft-1') {
    return 1;
  } else if (version === 'draft-2') {
    return 2;
  } else if (version === 'draft-3') {
    return 3;
  } else if (version === 'draft-4') {
    return 4;
  }
  return -1;
}
