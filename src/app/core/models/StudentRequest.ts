// task5 - ce que le front ENVOIE. Miroir de StudentRequestDTO cote Java.
// Pas d'id : il voyage dans l'URL (/api/students/{id}), jamais dans le corps.
export interface StudentRequest {
  firstName: string,
  lastName: string,
  email: string
}
