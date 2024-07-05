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
    protected $Fto_trabajador = null;

    //Aqui se guardaran las imagenes 
    const RUTA_IMAGEN = '../../../api/images/empleados/';

    //Método para buscar trabajadores dependiendo de su nombre o dui 
    public function searchRows()
    {
        //Valores que se introducen la barra de busqueda 
        $value = '%' . Validator::getSearchValue() . '%';
        //Sentencia select de los campos para la tabla de trabajadores
        $sql = 'SELECT id_trabajador, id_especializacion_trabajador, dui_trabajador, telefono_trabajador, correo_trabajador, nombres_trabajador, apellidos_trabajador, departamento_trabajador, NIT_trabajador, fecha_contratacion, salario_base, Fto_trabajador, nombre_especializacion_trabajador, id_especializacion_trabajador
        FROM tb_trabajadores
        INNER JOIN tb_especializaciones_trabajadores USING(id_especializacion_trabajador)
                WHERE nombres_trabajador LIKE ? OR dui_trabajador LIKE ?';
        //Parametros a enviar dependiendo de los valores de la barra de busqueda
        $params = array($value, $value);
        //Ejecucion de la consulta SQL
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

    // Método para verificar duplicados por valor (DUI o correo) y excluyendo el ID actual
    public function checkDuplicatedDui($value)
    {
        $sql = 'SELECT COUNT(*) as count FROM tb_trabajadores WHERE dui_trabajador = ?';
        $params = array($value);
        $result = Database::getRow($sql, $params);
        // Retorna true si el count es mayor que 0, de lo contrario, false.
        return $result['count'] > 0;
    }

    public function checkDuplicatedCorreo($value)
    {
        $sql = 'SELECT COUNT(*) as count FROM tb_trabajadores WHERE correo_trabajador = ?';
        $params = array($value);
        $result = Database::getRow($sql, $params);
        // Retorna true si el count es mayor que 0, de lo contrario, false.
        return $result['count'] > 0;
    }

    public function checkDuplicatedTelefono($value)
    {
        $sql = 'SELECT COUNT(*) as count FROM tb_trabajadores WHERE telefono_trabajador = ?';
        $params = array($value);
        $result = Database::getRow($sql, $params);
        // Retorna true si el count es mayor que 0, de lo contrario, false.
        return $result['count'] > 0;
    }

    public function checkDuplicatedNit($value)
    {
        $sql = 'SELECT COUNT(*) as count FROM tb_trabajadores WHERE NIT_trabajador = ?';
        $params = array($value);
        $result = Database::getRow($sql, $params);
        // Retorna true si el count es mayor que 0, de lo contrario, false.
        return $result['count'] > 0;
    }

    // Método para campos de todos los trabajadores
    public function readAll()
    {
        //consulta SQL para seleccionar todos los trabajadores de la tabla
        $sql = 'SELECT id_trabajador, id_especializacion_trabajador, dui_trabajador, telefono_trabajador, correo_trabajador, nombres_trabajador, apellidos_trabajador, departamento_trabajador, NIT_trabajador, fecha_contratacion, salario_base, Fto_trabajador, nombre_especializacion_trabajador, id_especializacion_trabajador
        FROM tb_trabajadores
        INNER JOIN tb_especializaciones_trabajadores USING(id_especializacion_trabajador)';
        return Database::getRows($sql); //Ejecución de la consulta SQL
    }

    // Método para leer 
    public function readOne()
    {
        // Consulta SQL para seleccionar a un trabajador en especifico 
        $sql = 'SELECT id_trabajador, tb_especializaciones_trabajadores.id_especializacion_trabajador, dui_trabajador, telefono_trabajador, correo_trabajador, nombres_trabajador, apellidos_trabajador, departamento_trabajador, NIT_trabajador, fecha_contratacion, salario_base, Fto_trabajador, nombre_especializacion_trabajador FROM tb_trabajadores INNER JOIN tb_especializaciones_trabajadores ON tb_trabajadores.id_especializacion_trabajador = tb_especializaciones_trabajadores.id_especializacion_trabajador WHERE id_trabajador = ?';
        //Parametro para seleccionar el trabajador por su id
        $params = array(
            $this->id_trabajador
        );
        return Database::getRow($sql, $params); //Ejecución de la consulta SQL
    }

    public function readEspecializaciones()
    {
        // Consulta SQL para seleccionar los campos del combo box
        $sql = 'SELECT id_especializacion_trabajador, nombre_especializacion_trabajador FROM tb_especializaciones_trabajadores;';
        return Database::getRows($sql); //Ejecución de la consulta SQL
    }


    //Metodo para
    public function readFilename()
    {
        //Consulta SQL para seleccionar la imagen del trabajador
        $sql = 'SELECT Fto_trabajador
                FROM tb_trabajadores
                WHERE id_trabajador = ?';
        //Parametro de id del trabajador para la consulta SQL
        $params = array($this->id_trabajador);
        return Database::getRow($sql, $params); //Ejecución de la consulta SQL
    }
}
