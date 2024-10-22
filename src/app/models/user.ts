export class User {
    uid!: string
    name!: string
    lastName!: string
    rol!: string
    email!: string
    photoURL!: string

    constructor(name: string, lastName: string, rol: string){
        this.name = name
        this.lastName = lastName
        this.rol = rol
    }
}