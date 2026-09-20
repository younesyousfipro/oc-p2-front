// task3 - identifiants envoyes a POST /api/login.
// Miroir de LoginRequestDTO cote back : les deux champs doivent porter exactement
// ces noms, c'est sur eux que Jackson fait la correspondance.
export interface Login {
  login: string,
  password: string
}
