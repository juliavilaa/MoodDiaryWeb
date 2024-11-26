import { FormBuilder } from '@angular/forms';
import { MetaService } from './../../services/meta.service'; 
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { take } from 'rxjs';
import { formatDate } from '@angular/common';


@Component({
    selector: 'app-meta',
    templateUrl: './meta.component.html',
    styleUrls: ['./meta.component.css']
})
export class MetaComponent {
    titlePage: string = 'Metas';
    metaList: any = [];
    metaForm: any = this.formBuilder.group({
      titulo: '',
      descripcion: '',
      /* fechaInicio: Date, */
      fechaFinalizacion: Date,
      estado: false //valor por defecto
    })
    editableMeta: boolean = false;
    idMeta: any;
    user = 'Usuario';

    constructor(
        private metaService: MetaService,
        private formBuilder: FormBuilder,
        private router: Router,
        private toastr: ToastrService
    ){}

    ngOnInit() {
        this.getAllMetas();
    }

    getAllMetas() {
        this.metaService.getAllMetasData(localStorage.getItem('accessToken')).subscribe(
            (data: {}) => {
                console.log(data);
                this.metaList = data;
            }
        );
    }

    newMetaEntry() {
        this.metaService.newMeta(localStorage.getItem('accessToken'), this.metaForm.value).subscribe(
            () => {
                //Redirigiendo a la ruta actual /meta y recargando la ventana
                this.router.navigate(['/metas']).then(() => {
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

    updateMetaEntry() {
        //Removiendo valores vacíos del formulario de actualización
        for (let key in this.metaForm.value) {
            if (this.metaForm.value[key] === '') {
                this.metaForm.removeControl(key);
            }
        }
        this.metaService.updateMeta(localStorage.getItem('accessToken'), this.idMeta, this.metaForm.value).subscribe(
            () => {
                //Enviando mensaje de confirmación
                this.newMessage("Meta editada");
            }
        );
    }

    toggleEditMeta(id: any) {
        this.idMeta = id;
        console.log(this.idMeta)
        this.metaService.getOneMeta(localStorage.getItem('accessToken'), id).subscribe(
            data => {
                this.metaForm.setValue({
                    titulo: data.titulo,
                    descripcion: data.descripcion,
                    /* fechaInicio: this.getValidDate(data.fechaInicio), */
                    fechaFinalizacion: this.getValidDate(data.fechaFinalizacion),
                    estado: data.estado
            } );
    }  );
        this.editableMeta = !this.editableMeta;
    }

    getValidDate(fecha: Date) {
        const fechaFinal: Date = new Date(fecha);
        //separado los datos
        var dd = fechaFinal.getDate() + 1; //fue necesario porque siempre daba un día antes
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

    deleteMetaEntry(id: any) {
        console.log(id)
        this.metaService.deleteMeta(localStorage.getItem('accessToken'), id).subscribe(
            () => {
                //Enviando mensaje de confirmación
                this.newMessage("Meta eliminada");
            }
        );
    }
}
