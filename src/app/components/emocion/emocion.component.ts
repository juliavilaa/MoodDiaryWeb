import { FormBuilder } from '@angular/forms';
import { EmocionService } from './../../services/emocion.service'; 
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { take } from 'rxjs';
import { formatDate } from '@angular/common';

@Component({
    selector: 'app-emocion',
    templateUrl: './emocion.component.html',
    styleUrls: ['./emocion.component.css']
  })
  export class EmocionComponent {
    titlePage: string = 'Emociones';
    emocionList: any = [];
    emocionForm: any = this.formBuilder.group({
      nombreEmocion: '',
      descripcion: '',
      fecha: Date
    })
    editableEmocion: boolean = false;
    idEmocion: any;
    user = 'Usuario';

    constructor(
        private emocionService: EmocionService,
        private formBuilder: FormBuilder,
        private router: Router,
        private toastr: ToastrService
    ){}

  

      ngOnInit() {
        this.getAllEmociones();
      }
    
    
      getAllEmociones() {
        this.emocionService.getAllEmocionesData(localStorage.getItem('accessToken')).subscribe(
          (data: {}) => {
            this.emocionList= data
          }
        );
      }
    
      newEmocionEntry() {
        this.emocionService.newEmocion(localStorage.getItem('accessToken'), this.emocionForm.value).subscribe(
          () => {
            //Redirigiendo a la ruta actual /emocion y recargando la ventana
            this.router.navigate(['/emocion']).then(() => {
              this.newMessage('Registro exitoso');
            })
          }
        );
      }

      newMessage(messageText: string) {
        this.toastr.success('Clic aquí para actualizar la lista', messageText)
          .onTap
          .pipe(take(1))
          .subscribe(() => window.location.reload());
      }
    
      updateEmocionEntry() {
        //Removiendo valores vacios del formulario de actualización
        for (let key in this.emocionForm.value) {
          if (this.emocionForm.value[key] === '') {
            this.emocionForm.removeControl(key);
          }
        }
        this.emocionService.updateEmocion(localStorage.getItem('accessToken'), this.idEmocion, this.emocionForm.value).subscribe(
          () => {
            //Enviando mensaje de confirmación
            this.newMessage("Emocion editada");
          }
        );
      }
    
      toggleEditEmocion(id: any) {
        this.idEmocion = id;
        console.log(this.idEmocion)
        this.emocionService.getOneEmocion(localStorage.getItem('accessToken'), id).subscribe(
          data => {
            this.emocionForm.setValue({
              nombreEmocion: data.nombreEmocion,
              descripcion: data.descripcion,
              fecha: this.getValidDate(data.fecha)
            });
          }
        );
        this.editableEmocion = !this.editableEmocion;
      }
    
      getValidDate(fecha: Date) {
        const fechaFinal: Date = new Date(fecha);
        //separado los datos
        var dd = fechaFinal.getDate() + 1;//fue necesario porque siempre daba un día antes
        var mm = fechaFinal.getMonth() + 1; //porque Enero es 0
        var yyyy = fechaFinal.getFullYear();
        var mes = '';
        var dia = '';
    
        //Como algunos meses tienen 31 días dd puede dar 32
        if (dd == 32) {
          dd = 1;
          mm++;
        }
        //Transformación de fecha cuando el día o mes son menores a 10
        //se le coloca un cero al inicio
        //Día
        if (dd < 10) {
          dia += `0${dd}`;
        } else {
          dia += `${dd}`;
        }
        //Mes
        if (mm < 10) {
          mes += `0${mm}`;
        } else {
          mes += `${mm}`;
        }
        //formatDate para colocar la fecha en un formato aceptado por el calendario
        //GMT-0500 es para Colombia
        var finalDate = formatDate(new Date(yyyy + '-' + mes + '-' + dia + ' GMT-0500'), 'yyyy-MM-dd', "en-US");
        return finalDate;
      }
    
      deleteEmocionEntry(id: any) {
        console.log(id)
        this.emocionService.deleteEmocion(localStorage.getItem('accessToken'), id).subscribe(
          () => {
            //Enviando mensaje de confirmación
            this.newMessage("Emocion eliminada");
          }
        );
      }
    }
    