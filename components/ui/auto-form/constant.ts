import type { InputComponents } from './interface'
import AutoFormFieldArray from '@@/components/ui/auto-form/AutoFormFieldArray.vue'
import AutoFormFieldBoolean from '@@/components/ui/auto-form/AutoFormFieldBoolean.vue'
import AutoFormFieldDate from '@@/components/ui/auto-form/AutoFormFieldDate.vue'
import AutoFormFieldEnum from '@@/components/ui/auto-form/AutoFormFieldEnum.vue'
import AutoFormFieldFile from '@@/components/ui/auto-form/AutoFormFieldFile.vue'
import AutoFormFieldInput from '@@/components/ui/auto-form/AutoFormFieldInput.vue'
import AutoFormFieldNumber from '@@/components/ui/auto-form/AutoFormFieldNumber.vue'
import AutoFormFieldObject from '@@/components/ui/auto-form/AutoFormFieldObject.vue'

export const INPUT_COMPONENTS: InputComponents = {
  date: AutoFormFieldDate,
  select: AutoFormFieldEnum,
  radio: AutoFormFieldEnum,
  checkbox: AutoFormFieldBoolean,
  switch: AutoFormFieldBoolean,
  textarea: AutoFormFieldInput,
  number: AutoFormFieldNumber,
  string: AutoFormFieldInput,
  file: AutoFormFieldFile,
  array: AutoFormFieldArray,
  object: AutoFormFieldObject,
}

/**
 * Define handlers for specific Zod types.
 * You can expand this object to support more types.
 */
export const DEFAULT_ZOD_HANDLERS: {
  [key: string]: keyof typeof INPUT_COMPONENTS
} = {
  ZodString: 'string',
  ZodBoolean: 'checkbox',
  ZodDate: 'date',
  ZodEnum: 'select',
  ZodNativeEnum: 'select',
  ZodNumber: 'number',
  ZodArray: 'array',
  ZodObject: 'object',
}
