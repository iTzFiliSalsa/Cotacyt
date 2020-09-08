import swal from 'sweetalert2';

export class Util{
    getInfo(information){
        swal.fire({
          title: 'Información del proyecto',
          text: information
        })
      }
}