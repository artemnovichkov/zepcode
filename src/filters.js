export default function camelizeFilter(str) {
  return str.replace(/\W+(.)/g, (match, chr) => chr.toUpperCase());
}
