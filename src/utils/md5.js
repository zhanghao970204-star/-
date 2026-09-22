import { md5 as jsMd5 } from 'js-md5'

export default function md5(value) {
  return jsMd5(String(value ?? ''))
}
