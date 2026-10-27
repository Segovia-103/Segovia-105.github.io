const notasForm = document.getElementById('notasForm');
const mensaje = document.getElementById('mensaje');
const resultado = document.getElementById('resultado');

notasForm.addEventListener('submit', function(event) {
    event.preventDefault();

    const nombre = document.getElementById('nombre').value.trim();
    const nie = document.getElementById('nie').value.trim();
    const nota1 = parseFloat(document.getElementById('nota1').value);
    const nota2 = parseFloat(document.getElementById('nota2').value);
    const nota3 = parseFloat(document.getElementById('nota3').value);
    const examen = parseFloat(document.getElementById('examen').value);

    const notas = [nota1, nota2, nota3, examen];
    for (let n of notas) {
        if (n < 0 || n > 10 || isNaN(n)) {
            mensaje.style.display = 'block';
            mensaje.className = 'error';
            mensaje.innerHTML = '⚠ ERROR<br>La nota debe estar entre 0 y 10.';
            resultado.style.display = 'none';
            return;
        }
    }

    const promedio = (nota1 + nota2 + nota3 + examen) / 4;
    const promedioStr = promedio.toFixed(2);

    let clasificacion = '';
    if (promedio >= 9.0 && promedio <= 10.0) {
        clasificacion = 'Excelente';
    } else if (promedio >= 7.0 && promedio <= 8.9) {
        clasificacion = 'Muy bueno';
    } else if (promedio >= 6.0 && promedio <= 6.9) {
        clasificacion = 'Aprobado';
    } else {
        clasificacion = 'Reprobado';
    }

    mensaje.style.display = 'block';
    mensaje.className = 'success';
    mensaje.textContent = 'REGISTRO CALCULADO CORRECTAMENTE';

    document.getElementById('resNombre').textContent = nombre;
    document.getElementById('resNie').textContent = nie;
    document.getElementById('resPromedio').textContent = promedioStr;
    document.getElementById('resClasificacion').textContent = clasificacion.toUpperCase();
    resultado.style.display = 'block';


    const lineaTxt = `${nie}|${nombre}|${nota1}|${nota2}|${nota3}|${examen}|${promedioStr}|${clasificacion}\n`;
 

    descargarArchivoTxt(lineaTxt);
});

function descargarArchivoTxt(contenido) {
    const blob = new Blob([contenido], { type: 'text/plain;charset=utf-8' });
    const enlace = document.createElement('a');
    enlace.href = URL.createObjectURL(blob);
    enlace.download = 'notas.txt';
    enlace.style.display = 'none';
    document.body.appendChild(enlace);
    enlace.click();
    document.body.removeChild(enlace);
}


const btnConsultar = document.getElementById('btnConsultar');
const archivoInput = document.getElementById('archivoInput');

btnConsultar.addEventListener('click', function() {
    const archivo = archivoInput.files[0];
    if (!archivo) {
        alert('Por favor, selecciona primero el archivo notas.txt');
        return;
    }

    const lector = new FileReader();
    lector.onload = function(e) {
        const contenido = e.target.result;
        const lineas = contenido.split('\n').filter(l => l.trim() !== '');

        const cuerpoTabla = document.getElementById('cuerpoTabla');
        cuerpoTabla.innerHTML = '';

        let totalEstudiantes = lineas.length;
        let aprobados = 0;
        let reprobados = 0;

        lineas.forEach(linea => {
            const partes = linea.split('|');
            if (partes.length >= 8) {
                const nie = partes[0];
                const nombre = partes[1];
                const promedio = partes[6];
                const clasificacion = partes[7];

                if (clasificacion.toLowerCase() !== 'reprobado') {
                    aprobados++;
                } else {
                    reprobados++;
                }

                const fila = document.createElement('tr');
                fila.innerHTML = `
                    <td style="padding: 8px; border: 1px solid #ddd;">${nie}</td>
                    <td style="padding: 8px; border: 1px solid #ddd;">${nombre}</td>
                    <td style="padding: 8px; border: 1px solid #ddd;">${promedio}</td>
                    <td style="padding: 8px; border: 1px solid #ddd;">${clasificacion}</td>
                `;
                cuerpoTabla.appendChild(fila);
            }
        });

       
        document.getElementById('totalEstudiantes').textContent = totalEstudiantes;
        document.getElementById('totalAprobados').textContent = aprobados;
        document.getElementById('totalReprobados').textContent = reprobados;

        document.getElementById('estadisticas').style.display = 'block';
        document.getElementById('tablaRegistros').style.display = 'table';
    };

    lector.readAsText(archivo);
});