import { GREL } from './util/Vocabularies';

export const rmlFunctions = {
  [GREL.array_length](data: Record<string | number, any>): number {
    const arr = Array.isArray(data[GREL.p_array_a])
      ? data[GREL.p_array_a] as any[]
      : [ data[GREL.p_array_a] as any ];
    return arr.length;
  },
}