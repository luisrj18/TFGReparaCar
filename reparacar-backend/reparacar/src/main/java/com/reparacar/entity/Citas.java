package com.reparacar.entity;

import java.io.Serializable;
import java.time.LocalDate;

import jakarta.persistence.*;
import jakarta.validation.constraints.Pattern;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "citas")
public class Citas implements Serializable {
    
    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "nombre", nullable = false)
    private String nombre;

    @Column(name = "modelo_vehiculo", nullable = false)
    private String modeloVehiculo;

    @Column(name = "matricula", nullable = false)
    private String matricula;

    @Column(name = "fecha", nullable = false)
    private LocalDate fecha;

    @Column(name = "hora", nullable = false)
    private String hora;

    @Column(name = "servicio", nullable = false)
    private String servicio;

    @Column(name = "descripcion", length = 1000)
    private String descripcion;

    @Pattern(regexp = "pending|confirmed|cancelled|completed", message = "Estado inválido")
    @Column(name = "estado", nullable = false)
    private String estado = "pending";

    // Aquí mantengo las relaciones pero con FetchType.EAGER para evitar problemas de LazyInitialization
    // y con @JsonIgnoreProperties para evitar problemas al serializar (si usas Jackson)

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "cliente_id", nullable = false)
    private Cliente cliente;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "taller_id", nullable = false)
    private Taller taller;

}
