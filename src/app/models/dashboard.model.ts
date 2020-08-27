export interface Totales {
    proyectos: string;
    autores: string;
    jueces: string;
    categorias: string;
}

export interface ProyectosCalificados {
    fecha: string;
    id_proyectos: string;
    nombre: string;
    resumen: string;
}

export interface ProyectosPorCalificar {
    id_proyectos: string;
    nombre: string;
    resumen: string;
}
/**git checkout -b 0.1.2
git add --all
git commit -m "Servicios de dashboard"
git push origin 0.1.2 */