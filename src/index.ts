import name, { mid_name, last_name, NOVO_NOME } from "@config/minha-config";

function hello(aux?: string) {
  return `Hello ${aux || name} ${mid_name} ${last_name}`;
}

console.log(hello("João"));
console.log(hello(NOVO_NOME));
