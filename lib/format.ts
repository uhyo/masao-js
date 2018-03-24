import { Validator } from 'jsonschema';

import {
  MasaoJSONFormat,
  MasaoJSONFormatVersion,
  AdvancedMap,
  StageObject,
  LayerObject,
  formatVersionToNumber,
} from './format/data';

import { checkAdvancedMap, sanitizeAdvancedMap } from './format/advanced-map';

export {
  MasaoJSONFormat,
  MasaoJSONFormatVersion,
  AdvancedMap,
  StageObject,
  LayerObject,
  sanitizeAdvancedMap,
};

//format
const schema = require('./format-schema.json');

export interface LoadOptions {
  throwError?: boolean;
  nestedErrors?: boolean;
  logErrors?: boolean;
}
//load masao-json-format object and update to latest.
export function load(obj: any, options?: LoadOptions): MasaoJSONFormat {
  const validator = new Validator();
  const vresult = validator.validate(obj, schema, options);

  if (!vresult.valid) {
    //JSON Schemaにあてはまらなくてだめ
    if (options && options.logErrors) {
      // for debug purpose
      console.error(vresult.errors);
    }
    throw vresult.errors[vresult.errors.length - 1];
  }

  const version = formatVersionToNumber(obj['masao-json-format-version']);
  if (version === -1) {
    //unsupported version
    throw new Error('Unsupported masao-json-format version.');
  }
  const result = {
    ...obj,
  };
  //support draft-4
  result['masao-json-format-version'] = 'draft-4';
  //version
  if (version < 2) {
    //versionが未サポートなのでデフォルト値を
    result['version'] = 'fx16';
  } else if (!isValidVersion(obj['version'])) {
    //バージョンが書いてあるけどだめ
    throw new Error(`Unsupported masao version: "${obj['version']}"`);
  }

  //script
  if (version < 3) {
    result['script'] = null;
  } else if (obj['script'] == null) {
    result['script'] = null;
  }

  // advanced-map
  if (version < 4) {
    result['advanced-map'] = null;
  } else if (result['advanced-map'] == null) {
    result['advanced-map'] = null;
  } else {
    checkAdvancedMap(result['advanced-map']);
  }
  return result;
}

//make masao-json-format object
/*
 * options: {
 *   params: object,
 *   version?: string,
 *   metadata?: {
 *     title?: string,
 *     author?: string,
 *     editor?: string
 *   },
 *   script: string
 *   "advanced-map": {
 *     
 *   }
 * }   
 */
export interface MakeOptions {
  params: MasaoJSONFormat['params'];
  version: MasaoJSONFormat['version'];
  metadata?: MasaoJSONFormat['metadata'];
  script?: MasaoJSONFormat['script'];
  'advanced-map'?: AdvancedMap;
}
export function make(options: MakeOptions): MasaoJSONFormat {
  //validate
  const result: any = {
    'masao-json-format-version': 'draft-4',
  };
  if (options.params == null || 'object' !== typeof options.params) {
    throw new Error('Invalid value of params');
  }
  result.params = options.params;
  if (options.metadata != null) {
    if ('object' !== typeof options.metadata) {
      throw new Error('Invalid value of metadata');
    }
    if (
      options.metadata.title != null &&
      'string' !== typeof options.metadata.title
    ) {
      throw new Error('Invalid value of metadata.title');
    }
    if (
      options.metadata.author != null &&
      'string' !== typeof options.metadata.author
    ) {
      throw new Error('Invalid value of metadata.title');
    }
    if (
      options.metadata.editor != null &&
      'string' !== typeof options.metadata.editor
    ) {
      throw new Error('Invalid value of metadata.title');
    }
    result.metadata = options.metadata;
  }
  if (!isValidVersion(options.version)) {
    throw new Error('Invalid value of version');
  }
  result.version = options.version;
  if (options.script != null && 'string' !== typeof options.script) {
    throw new Error('Invalid script');
  }
  result.script = options.script;

  const adv = options['advanced-map'];
  if (adv != null) {
    checkAdvancedMap(adv);
    result['advanced-map'] = adv;
  }
  return result;
}

//version
function isValidVersion(version: string): boolean {
  return (
    [
      '2.7',
      '2.8',
      '2.9',
      '3.0',
      '3.11',
      '3.12',
      'fx',
      'fx2',
      'fx3',
      'fx4',
      'fx5',
      'fx6',
      'fx7',
      'fx8',
      'fx9',
      'fx10',
      'fx11',
      'fx12',
      'fx13',
      'fx14',
      'fx15',
      'fx16',
      'kani',
      'kani2',
    ].indexOf(version) >= 0
  );
}
