// task5 - ce que le back RENVOIE. Miroir de StudentDTO cote Java.
// Porte l'id, indispensable pour construire les URLs de detail, modification
// et suppression.
export interface Student {
  id: number,
  firstName: string,
  lastName: string,
  email: string
}
