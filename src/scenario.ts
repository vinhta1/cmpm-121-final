import YAML from "js-yaml";

const yamlString = `
name: John Doe
age: 30
city: New York
`;

export const data = YAML.load(yamlString);
