package com.reparacar.dto;

import java.io.Serializable;
import java.time.LocalDate;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CitasDTO implements Serializable {

    private static final long serialVersionUID = 1L;

    private String nombre;
    private String modeloVehiculo;
    private String matricula;
    private LocalDate fecha;
    private String hora;
    private String servicio;
    private String descripcion;
    private String estado; // "pending", "confirmed", "cancelled", "completed"
    
    private Long cliente_id;
    private Long taller_id;
}
