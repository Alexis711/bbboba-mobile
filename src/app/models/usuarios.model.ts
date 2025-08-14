export class Usuarios {
    usu_id!: string;
    usu_nom_usu!: string;
    usu_nombres!: string;
    usu_apellidos!: string;
    usu_correo!: string;
    usu_telefono!: string;
    usu_clave!: string;
    usu_estatus!: number;
    usu_rol!: number;

    constructor(init?: Partial<Usuarios>) {
        Object.assign(this, init);
    }
}
