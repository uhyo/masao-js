export interface CustomPartsPropertyBase {
  description: string;
}

/**
 * Property which takes integernumber.
 */
export interface IntegerProperty extends CustomPartsPropertyBase {
  type: 'integer';
  unit: 'px' | 'f' | 'px/f' | 'px/f/f' | 'deg/f';
  default: number;
}

/**
 * Property which takes bag of timing.
 */
export interface TimingProperty<V = unknown> extends CustomPartsPropertyBase {
  type: 'timing';
  values: V[];
  default: Record<number, V>;
}

/**
 * Information of one custom parts property.
 */
export type CustomPartsProperty = IntegerProperty | TimingProperty<unknown>;

export type CustomPartsPropertySet = Record<string, CustomPartsProperty>;

export type CustomPartsProperties = Record<number, CustomPartsPropertySet>;
