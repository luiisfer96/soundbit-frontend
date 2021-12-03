

export interface AuthResponse {
    usuario: Usuario,
    token?: string
}

export interface Usuario {
    img?: string,
    rol?: string,
    estado?: boolean,
    google?: boolean,
    nombre?: string,
    correo?: string,
    uid?: string,
    password?: string,
}