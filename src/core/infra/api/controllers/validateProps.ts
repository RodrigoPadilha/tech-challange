export const validateProps = (requiredProps: string[], body: any) => {
  const missingProps = requiredProps.filter((prop) => !(prop in body));
  return missingProps;
};
