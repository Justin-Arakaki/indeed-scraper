import _ from 'lodash';

export default function searchKeywords(
  string: string,
  keywords: string[]
): string[] {
  const regex = new RegExp(keywords.join('|'), 'gi');
  const found = string.match(regex);
  const foundLowerCase: string[] = [];

  if (found === null) return [];
  for (const keyword of found) {
    foundLowerCase.push(keyword.toLowerCase());
  }
  return _.uniq(found);
}
