export const hasProperties = (o: any, props: string[]): boolean => {
  for (const prop of props) {
    if (!(prop in o)) {
      return false;
    }
  }
  return true;
};
