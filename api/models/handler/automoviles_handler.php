<?php
// Se incluye la clase para trabajar con la base de datos.
require_once('../../helpers/database.php');

/*
 *  Clase para manejar el comportamiento de los datos de la tabla automoviles.
 */
class AutomovilHandler
{
    protected $id_automovil = null;
    protected $modelo_automovil = null; // Cambiado a VARCHAR
    protected $id_tipo_automovil = null;
    protected $color_automovil = null;
    protected $fecha_fabricacion_automovil = null;
    protected $placa_automovil = null;
    protected $imagen_automovil = null;
    protected $id_cliente = null;
    protected $fecha_registro = null;
    protected $estado_automovil = null;
    protected $id_marca_automovil = null;
    protected $nombre_marca_automovil = null;
    protected $search_value = null;
    protected $fecha_desde = null;
    protected $fecha_hasta = null;
    protected $fecha_inicial = null;
    protected $fecha_final = null;

    const RUTA_IMAGEN = '../../../api/images/automoviles/';

    public function getIdCliente($DuiCliente)
    {
        // Definimos la consulta SQL para obtener la fecha de última modificación
        $sql = "SELECT id_cliente FROM tb_clientes WHERE dui_cliente = ?;";
        // Establecemos los parámetros para la consulta (en este caso, el ID del usuario)
        $params = array($DuiCliente);
        // Ejecuta la consulta y retorna la fecha de última modificación o null si no se encuentra
        return Database::getRow($sql, $params)['id_cliente'] ?? null;
    }

    public function searchAutosByPlaca()
    {
        // Consulta SQL para leer todos los automóviles eliminados del cliente actual
        $sql = 'SELECT c.nombres_cliente AS nombre_cliente,
                    c.dui_cliente AS dui_cliente,
                    a.*,
                    a.imagen_automovil
                FROM tb_automoviles a
                INNER JOIN tb_clientes c USING(id_cliente)
                WHERE estado_automovil = "Activo" AND a.placa_automovil = ? AND id_cliente = ?;';
        $params = array(
            $this->placa_automovil,
            $_SESSION['idUsuarioCliente']
        );

        return Database::getRows($sql, $params);
    }

    public function searchRows()
    {
        // Consulta SQL para buscar automóviles
        $sql = 'SELECT 
        c.nombres_cliente AS nombre_cliente,
        c.dui_cliente AS dui_cliente,
        ma.nombre_marca_automovil AS nombre_marca,
        a.id_automovil,
        a.modelo_automovil,
        a.id_tipo_automovil,
        a.color_automovil,
        a.fecha_fabricacion_automovil,
        a.placa_automovil,
        a.imagen_automovil,
        a.id_cliente,
        a.id_marca_automovil,
        a.fecha_registro,
        a.estado_automovil
    FROM 
        tb_automoviles a
    INNER JOIN 
        tb_clientes c ON a.id_cliente = c.id_cliente
    INNER JOIN 
        tb_marcas_automoviles ma ON a.id_marca_automovil = ma.id_marca_automovil
    WHERE 
        a.estado_automovil = ?';

        $params = array('Activo');

        if ($this->search_value) {
            $value = '%' . $this->search_value . '%'; // Agregar comodines para búsqueda parcial
            $sql .= " AND a.placa_automovil LIKE ?";
            $params[] = $value; // Usar el valor modificado
        }

        return Database::getRows($sql, $params);
    }

    public function readOne()
    {
        $sql = 'SELECT * FROM tb_automoviles WHERE id_automovil = ?';
        $params = array(
            $this->id_automovil
        );
        return Database::getRow($sql, $params);
    }

    public function updateRow()
    {
        // Consulta SQL para actualizar un automóvil
        $sql = 'UPDATE tb_automoviles SET 
        modelo_automovil = ?,
        id_tipo_automovil = ?,
        color_automovil = ?,
        fecha_fabricacion_automovil = ?,
        placa_automovil = ?,
        imagen_automovil = ?,
        id_marca_automovil = ?,
        id_cliente = ?
        WHERE id_automovil = ?';

        // Asegúrate de que las propiedades están bien asignadas
        $params = array(
            $this->modelo_automovil,
            $this->id_tipo_automovil,
            $this->color_automovil,
            $this->fecha_fabricacion_automovil,
            $this->placa_automovil,
            $this->imagen_automovil, // Verifica que este campo se maneje correctamente si la imagen no se actualiza
            $this->id_marca_automovil,
            $this->id_cliente, // Verifica si este campo es necesario
            $this->id_automovil
        );

        // Ejecutar la consulta
        return Database::executeRow($sql, $params);
    }


    public function deleteRow()
    {
        // Consulta SQL para eliminar un automóvil (marcarlo como eliminado)
        $sql = 'UPDATE tb_automoviles SET estado_automovil = "Eliminado"
            WHERE id_automovil = ?';
        $params = array($this->id_automovil);
        return Database::executeRow($sql, $params);
    }

    public function createRow()
    {
        $sql = 'INSERT INTO tb_automoviles(
        modelo_automovil,
        id_tipo_automovil, 
        color_automovil,
        fecha_fabricacion_automovil,
        placa_automovil, 
        imagen_automovil,
        id_marca_automovil,
        id_cliente,
        fecha_registro,
        estado_automovil) VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW(), "Activo")';

        $params = array(
            $this->modelo_automovil,
            $this->id_tipo_automovil,
            $this->color_automovil,
            $this->fecha_fabricacion_automovil,
            $this->placa_automovil,
            $this->imagen_automovil,
            $this->id_marca_automovil,
            $_SESSION['idUsuarioCliente']
        );
        return Database::executeRow($sql, $params); // Ejecución de la consulta SQL
    }

    //Sacar el dui de seleccionar el id y dui de tbUsuarios
    public function createRowAdmin()
    {
        // Consulta SQL para insertar un nuevo automóvil
        $sql = 'INSERT INTO tb_automoviles(
            modelo_automovil,
            id_tipo_automovil, 
            color_automovil,
            fecha_fabricacion_automovil,
            placa_automovil, 
            imagen_automovil,
            id_cliente,
            id_marca_automovil,
            fecha_registro,
            estado_automovil) VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW(), "Activo")';

        $params = array(
            $this->modelo_automovil,
            $this->id_tipo_automovil,
            $this->color_automovil,
            $this->fecha_fabricacion_automovil,
            $this->placa_automovil,
            $this->imagen_automovil,
            $this->id_cliente,
            $this->id_marca_automovil
        ); // Parámetros para la consulta SQL

        return Database::executeRow($sql, $params); // Ejecución de la consulta SQL
    }

    public function checkDuplicate($value)
    {
        // Consulta SQL para verificar duplicados
        $sql = 'SELECT id_automovil FROM tb_automoviles 
        WHERE (placa_automovil = ?)';
        $params = array(
            $value,
        ); // Parámetros para la consulta SQL

        if ($this->id_automovil) {
            $sql .= ' AND id_automovil <> ?;';
            $params[] = $this->id_automovil;
        }

        return Database::getRows($sql, $params); // Ejecución de la consulta SQL
    }

    public function readAll()
    {
        // Consulta SQL para leer todos los automóviles activos
        $sql = 'SELECT 
        c.nombres_cliente AS nombre_cliente,
        c.dui_cliente AS dui_cliente,
        ma.nombre_marca_automovil AS nombre_marca,
        a.id_automovil,
        a.modelo_automovil,
        a.id_tipo_automovil,
        a.color_automovil,
        a.fecha_fabricacion_automovil,
        a.placa_automovil,
        a.imagen_automovil,
        a.id_cliente,
        a.id_marca_automovil,
        a.fecha_registro,
        a.estado_automovil
        FROM 
        tb_automoviles a
        INNER JOIN 
        tb_clientes c ON a.id_cliente = c.id_cliente
        INNER JOIN 
        tb_marcas_automoviles ma ON a.id_marca_automovil = ma.id_marca_automovil
        WHERE 
        a.estado_automovil = "Activo";';
        return Database::getRows($sql);
    }

    public function graphicCarsByType()
    {
        // Consulta SQL para leer todos los automóviles activos
        $sql = 'SELECT * FROM vw_autos_por_tipo;';
        return Database::getRows($sql);
    }

    public function readAllMyCars()
    {
        // Consulta SQL para leer todos los automóviles del cliente actual, incluyendo la imagen del automóvil
        $sql = 'SELECT c.nombres_cliente AS nombre_cliente,
                    c.dui_cliente AS dui_cliente,
                    a.*,
                    a.imagen_automovil
                FROM tb_automoviles a
                INNER JOIN tb_clientes c USING(id_cliente)
                WHERE estado_automovil = "Activo" AND id_cliente = ?;';
        $params = array(
            $_SESSION['idUsuarioCliente']
        );
        return Database::getRows($sql, $params);
    }


    public function readAllDelete()
    {
        // Consulta SQL para leer todos los automóviles eliminados del cliente actual
        $sql = 'SELECT c.nombres_cliente AS nombre_cliente,
                    c.dui_cliente AS dui_cliente,
                    a.*,
                    a.imagen_automovil
                FROM tb_automoviles a
                INNER JOIN tb_clientes c USING(id_cliente)
                WHERE estado_automovil = "Eliminado" AND id_cliente = ?;';
        $params = array(
            $_SESSION['idUsuarioCliente']
        );
        return Database::getRows($sql, $params);
    }

    public function readDetail()
    {
        // Consulta SQL para leer el detalle de un automóvil
        $sql = 'SELECT c.nombres_cliente AS nombre_cliente,
        c.dui_cliente AS dui_cliente,
        ma.nombre_marca_automovil AS nombre_marca,
        t.nombre_tipo_automovil AS nombre_tipo,
        a.*
        FROM tb_automoviles a
        INNER JOIN tb_clientes c USING(id_cliente)
        INNER JOIN tb_marcas_automoviles ma USING(id_marca_automovil)
        INNER JOIN tb_tipos_automoviles t USING (id_tipo_automovil)
        WHERE estado_automovil = "Activo" AND id_automovil = ?;';
        $params = array(
            $this->id_automovil
        );
        return Database::getRow($sql, $params);
    }

    public function readClientes()
    {
        // Consulta SQL para leer el detalle de un automóvil
        $sql = 'SELECT id_cliente, dui_cliente FROM tb_clientes ORDER BY id_cliente DESC;';
        return Database::getRows($sql);
    }

    public function readDeleteDetail()
    {
        // Consulta SQL para leer el detalle de un automóvil eliminado
        $sql = 'SELECT c.nombres_cliente AS nombre_cliente,
        c.dui_cliente AS dui_cliente,
        co.nombre_color AS nombre_color,
        mo.nombre_modelo_automovil AS nombre_modelo,
        ma.nombre_marca_automovil AS nombre_marca,
        t.nombre_tipo_automovil AS nombre_tipo,
        a.*
        FROM tb_automoviles a
        INNER JOIN tb_clientes c USING(id_cliente)
        INNER JOIN tb_colores co USING(id_color)
        INNER JOIN tb_modelos_automoviles mo USING(modelo_automovil) // Cambio aquí
        INNER JOIN tb_marcas_automoviles ma USING(id_marca_automovil)
        INNER JOIN tb_tipos_automoviles t USING (id_tipo_automovil)
        WHERE estado_automovil = "Eliminado" AND id_automovil = ?;';
        $params = array(
            $this->id_automovil
        );
        return Database::getRow($sql, $params);
    }

    public function readImage()
    {
        // Consulta SQL para leer la imagen de un automóvil
        $sql = 'SELECT imagen_automovil FROM tb_automoviles WHERE id_automovil = ?';
        $params = array($this->id_automovil);
        return Database::getRow($sql, $params);
    }

    public function readTipos()
    {
        // Consulta SQL para leer los tipos de automóviles
        $sql = 'SELECT id_tipo_automovil, nombre_tipo_automovil FROM tb_tipos_automoviles';
        return Database::getRows($sql);
    }

    public function readMarcas()
    {
        // Consulta SQL para leer los tipos de automóviles
        $sql = 'SELECT id_marca_automovil, nombre_marca_automovil FROM tb_marcas_automoviles';
        return Database::getRows($sql);
    }

    public function reportTipoAutoYFecha()
    {
        $sql = 'SELECT 
        a.modelo_automovil AS modelo,
        t.nombre_tipo_automovil AS tipo_automovil,
        c.nombres_cliente AS nombre_propietario,
        s.nombre_servicio AS nombre_servicio,
        COUNT(s_proc.id_servicio_en_proceso) AS cantidad_servicios,
        cit.fecha_hora_cita AS fecha_cita
        FROM 
        tb_citas cit
        JOIN 
        tb_automoviles a ON cit.id_automovil = a.id_automovil
        JOIN 
        tb_tipos_automoviles t ON a.id_tipo_automovil = t.id_tipo_automovil
        JOIN 
        tb_clientes c ON a.id_cliente = c.id_cliente
        JOIN 
        tb_servicios_en_proceso s_proc ON cit.id_cita = s_proc.id_cita
        JOIN 
        tb_servicios s ON s_proc.id_servicio = s.id_servicio
        WHERE 
        t.id_tipo_automovil = ?
        AND cit.fecha_hora_cita BETWEEN ? AND ?
        GROUP BY 
        a.modelo_automovil, t.nombre_tipo_automovil, c.nombres_cliente, s.nombre_servicio, cit.fecha_hora_cita
        ORDER BY 
        cantidad_servicios DESC, cit.fecha_hora_cita;';
        $params = array($this->id_tipo_automovil, $this->fecha_inicial, $this->fecha_final);
        return Database::getRows($sql, $params);
    }

    public function reportEstadoAutomovil($id_automovil)
    {
        $sql = 'SELECT 
                        a.estado_automovil AS Estado_Automovil,
                        s.nombre_servicio AS Servicio,
                        COUNT(sp.id_servicio_en_proceso) AS Veces_Reparado
                    FROM 
                        tb_automoviles a
                    JOIN 
                        tb_citas c ON a.id_automovil = c.id_automovil
                    JOIN 
                        tb_servicios_en_proceso sp ON c.id_cita = sp.id_cita
                    JOIN 
                        tb_servicios s ON sp.id_servicio = s.id_servicio
                    WHERE 
                        a.id_automovil = ?
                    GROUP BY 
                        a.estado_automovil, s.nombre_servicio
                    ORDER BY 
                        Veces_Reparado DESC
                    LIMIT 0, 25;';
        $params = array($id_automovil);
        return Database::getRows($sql, $params);
    }

    public function createMarcaAutomovil()
    {
        $sql = 'INSERT INTO tb_marcas_automoviles(
        nombre_marca_automovil) VALUES (?)';

        $params = array(
            $this->nombre_marca_automovil
        );
        return Database::executeRow($sql, $params); // Ejecución de la consulta SQL
    }

    public function updateRowMarcaAutomovil()
    {
        // Consulta SQL para actualizar un automóvil
        $sql = 'UPDATE tb_marcas_automoviles SET 
        nombre_marca_automovil = ?
        WHERE id_marca_automovil = ?';

        // Asegúrate de que las propiedades están bien asignadas
        $params = array(
            $this->nombre_marca_automovil,
            $this->id_marca_automovil
        );

        // Ejecutar la consulta
        return Database::executeRow($sql, $params);
    }

    public function deleteRowMarcaAutomovil()
    {
        // Consulta SQL para eliminar un cliente basado en su ID
        $sql = 'DELETE FROM tb_marcas_automoviles
            WHERE id_marca_automovil = ?';
        // Parámetros de la consulta SQL, usando el ID del cliente proporcionado por la clase
        $params = array($this->id_marca_automovil);
        // Ejecuta la consulta de eliminación y devuelve el resultado
        return Database::executeRow($sql, $params);
    }

    public function readAllMarcasAutomoviles()
    {
        // Consulta SQL para leer todos los automóviles activos
        $sql = 'SELECT * FROM tb_marcas_automoviles;';
        return Database::getRows($sql);
    }

    public function searchRowsMarcasAutomoviles()
    {
        $value = '%' . Validator::getSearchValue() . '%';
        $sql = 'SELECT id_marca_automovil, nombre_marca_automovil
                FROM tb_marcas_automoviles
                WHERE nombre_marca_automovil LIKE ?
                ORDER BY nombre_marca_automovil';
        $params = array($value);
        return Database::getRows($sql, $params);
    }
}
