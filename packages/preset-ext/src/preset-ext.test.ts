import { assert, test, afterEach } from 'vitest'

import { twind, virtual } from 'twind'

import presetTailwind from '@twind/preset-tailwind'
import presetExt from '.'
import data from './preset-ext.test.json'

const tw = twind(
  {
    presets: [presetExt(), presetTailwind({ enablePreflight: false })],
    variants: [
      ['as-dark', '.dark &'],
      ['not-logged-in', 'body:not(.logged-in) &'],
    ],
  },
  virtual(),
)

afterEach(() => tw.clear())

Object.entries(data)
  .map(([tokens, declarations]): [string, string, string[]] => {
    if (Array.isArray(declarations)) {
      return Array.isArray(declarations[1])
        ? [tokens, declarations[0] as string, declarations[1]]
        : [tokens, tokens, declarations as string[]]
    }

    return [tokens, tokens, [declarations]]
  })
  .forEach(([tokens, classNames, rules]) =>
    test(`${JSON.stringify(tokens)} => ${classNames}`, () => {
      assert.strictEqual(tw(tokens), classNames)
      assert.deepEqual(tw.target, rules)

      // Cached access
      assert.strictEqual(tw(tokens), classNames)
      assert.deepEqual(tw.target, rules)
    }),
  )
