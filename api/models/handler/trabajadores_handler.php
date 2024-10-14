<?php
// Se incluye la clase para trabajar con la base de datos.
require_once('../../helpers/database.php');
/*
 *  Clase para manejar el comportamiento de los datos de la tabla trabajadores.
 */

class TrabajadoresHandler
{
    protected $id_trabajador = null;
    protected $id_especializacion_trabajador = null;
    protected $dui_trabajador = null;
    protected $telefono_trabajador = null;
    protected $correo_trabajador = null;
    protected $nombres_trabajador = null;
    protected $apellidos_trabajador = null;
    protected $departamento_trabajador = null;
    protected $NIT_trabajador = null;
    protected $fecha_contratacion = null;
    protected $salario_base = null;
    protected $agno_contratacion = null;
    protected $search_value = null;

    //Aqui se guardaran las imagenes 
    const RUTA_IMAGEN = '../../../api/images/empleados/';

    public function empleadosPorMesyEsp()
    {
        $sql = 'CALL GetEmpleadosPorMesYEspecialidad(?);';
        $params = array($this->agno_contratacion);
        //Ejecucion de la consulta SQL
        return Database::getRows($sql, $params);
    }


    //Método para buscar trabajadores dependiendo de su nombre o dui 
    // Método para buscar trabajadores dependiendo de su nombre o DUI
    public function searchRows()
    {
        // Iniciamos la consulta base con el JOIN
        $sql = 'SELECT 
                id_trabajador, 
                dui_trabajador, 
                telefono_trabajador, 
                correo_trabajador, 
                nombres_trabajador, 
                apellidos_trabajador, 
                departamento_trabajador, 
                NIT_trabajador, 
                fecha_contratacion, 
                salario_base, 
                nombre_especializacion_trabajador
            FROM tb_trabajadores 
            INNER JOIN tb_especializaciones_trabajadores USING(id_especializacion_trabajador)';

        $params = [];

        // Si hay un valor de búsqueda, agregamos la condición de búsqueda
        if ($this->search_value) {
            $sql .= ' WHERE (
            CONCAT(nombres_trabajador, " ", apellidos_trabajador) LIKE ? OR 
            dui_trabajador LIKE ? OR 
            telefono_trabajador LIKE ? OR  
            correo_trabajador LIKE ? OR  
            NIT_trabajador LIKE ?
        )';

            // Se añade el mismo valor de búsqueda para todas las condiciones
            $params[] = "%{$this->search_value}%";
            $params[] = "%{$this->search_value}%";
            $params[] = "%{$this->search_value}%";
            $params[] = "%{$this->search_value}%";
            $params[] = "%{$this->search_value}%";
        }

        // Ejecutamos la consulta con o sin parámetros, según sea el caso
        return Database::getRows($sql, $params);
    }

    //Método para actualizar los datos de un trabajador
    public function updateRow()
    {
        //Sentencia update para los datos dependiendo del id del trabajador
        $sql = 'UPDATE tb_trabajadores SET 
        dui_trabajador = ?,
        NIT_trabajador = ?,
        nombres_trabajador = ?,
        apellidos_trabajador = ?,
        telefono_trabajador = ?,
        correo_trabajador = ?,
        departamento_trabajador = ?,
        id_especializacion_trabajador = ?,
        fecha_contratacion = ?,
        salario_base = ?
        WHERE id_trabajador = ?';
        //Parametros a enviar a los campos de tabla
        $params = array(
            $this->dui_trabajador,
            $this->NIT_trabajador,
            $this->nombres_trabajador,
            $this->apellidos_trabajador,
            $this->telefono_trabajador,
            $this->correo_trabajador,
            $this->departamento_trabajador,
            $this->id_especializacion_trabajador,
            $this->fecha_contratacion,
            $this->salario_base,
            $this->id_trabajador
        );
        return Database::executeRow($sql, $params); //Ejecución de la consulta SQL
    }

    public function deleteRow()
    {
        // Consulta SQL para eliminar un cliente basado en su ID
        $sql = 'DELETE FROM tb_trabajadores
            WHERE id_trabajador = ?';
        // Parámetros de la consulta SQL, usando el ID del cliente proporcionado por la clase
        $params = array($this->id_trabajador);
        // Ejecuta la consulta de eliminación y devuelve el resultado
        return Database::executeRow($sql, $params);
    }

    // Método para crear un nuevo trabajador
    public function createRow()
    {
        //Consulta SQL para agregar a trabajadores con los datos 
        $sql = 'INSERT INTO tb_trabajadores(
            dui_trabajador, 
            NIT_trabajador, 
            nombres_trabajador,
            apellidos_trabajador,
            telefono_trabajador, 
            correo_trabajador,
            departamento_trabajador,
            id_especializacion_trabajador,
            fecha_contratacion,
            salario_base) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
        // Parámetros para la consulta SQL
        $params = array(
            $this->dui_trabajador,
            $this->NIT_trabajador,
            $this->nombres_trabajador,
            $this->apellidos_trabajador,
            $this->telefono_trabajador,
            $this->correo_trabajador,
            $this->departamento_trabajador,
            $this->id_especializacion_trabajador,
            $this->fecha_contratacion,
            $this->salario_base
        );
        return Database::executeRow($sql, $params); // Ejecución de la consulta SQL
    }

    public function checkDuplicate($value, $field)
    {
        // Construir la consulta SQL para verificar duplicados
        $sql = "SELECT id_trabajador FROM tb_trabajadores WHERE $field = ?";

        // Parámetro para la consulta SQL
        $params = array($value);

        // Si se está actualizando (ya hay un id_trabajador), excluir ese ID de la búsqueda
        if ($this->id_trabajador) {
            $sql .= " AND id_trabajador <> ?";
            $params[] = $this->id_trabajador; // Añadir el ID del trabajador actual como parámetro
        }

        // Ejecuta la consulta SQL y devuelve los resultados
        return Database::getRows($sql, $params);
    }



    // Método para campos de todos los trabajadores
    public function readAll()
    {
        //consulta SQL para seleccionar todos los trabajadores de la tabla
        $sql = 'SELECT id_trabajador, id_especializacion_trabajador, dui_trabajador, telefono_trabajador, correo_trabajador, nombres_trabajador, apellidos_trabajador, departamento_trabajador, NIT_trabajador, fecha_contratacion, salario_base, nombre_especializacion_trabajador, id_especializacion_trabajador
        FROM tb_trabajadores
        INNER JOIN tb_especializaciones_trabajadores USING(id_especializacion_trabajador)';
        return Database::getRows($sql); //Ejecución de la consulta SQL
    }

    // Método para leer 
    public function readOne()
    {
        // Consulta SQL para seleccionar a un trabajador en especifico 
        $sql = 'SELECT id_trabajador, tb_especializaciones_trabajadores.id_especializacion_trabajador, dui_trabajador, telefono_trabajador, correo_trabajador, nombres_trabajador, apellidos_trabajador, departamento_trabajador, NIT_trabajador, fecha_contratacion, salario_base, nombre_especializacion_trabajador FROM tb_trabajadores INNER JOIN tb_especializaciones_trabajadores ON tb_trabajadores.id_especializacion_trabajador = tb_especializaciones_trabajadores.id_especializacion_trabajador WHERE id_trabajador = ?';
        //Parametro para seleccionar el trabajador por su id
        $params = array(
            $this->id_trabajador
        );
        return Database::getRow($sql, $params); //Ejecución de la consulta SQL
    }

    // Método para campos de todos los trabajadores
    public function readAllReporte()
    {
        //consulta SQL para seleccionar todos los trabajadores de la tabla
        $sql = 'SELECT id_trabajador, id_especializacion_trabajador, dui_trabajador, telefono_trabajador, 
        correo_trabajador, CONCAT(nombres_trabajador , " ", apellidos_trabajador) AS trabajador, departamento_trabajador, NIT_trabajador, 
        fecha_contratacion, salario_base, nombre_especializacion_trabajador, id_especializacion_trabajador
        FROM tb_trabajadores
        INNER JOIN tb_especializaciones_trabajadores USING(id_especializacion_trabajador)';
        return Database::getRows($sql); //Ejecución de la consulta SQL
    }

    public function readEspecializaciones()
    {
        // Consulta SQL para seleccionar los campos del combo box
        $sql = 'SELECT id_especializacion_trabajador, nombre_especializacion_trabajador FROM tb_especializaciones_trabajadores;';
        return Database::getRows($sql); //Ejecución de la consulta SQL
    }
}
