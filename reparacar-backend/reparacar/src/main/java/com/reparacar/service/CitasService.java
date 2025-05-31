package com.reparacar.service;

import com.reparacar.dto.CitasDTO;

import java.time.LocalDate;
import java.util.List;

public interface CitasService {

    // Crear una nueva cita
    CitasDTO crearCita(CitasDTO citaDTO);

    // Obtener todas las citas
    List<CitasDTO> obtenerTodasCitas();

    // Obtener una cita por ID
    CitasDTO obtenerCitaPorId(Long id);

    // Actualizar una cita existente
    CitasDTO actualizarCita(Long id, CitasDTO citaDTO);

    // Eliminar una cita
    void eliminarCita(Long id);

    // Buscar citas por nombre del cliente
    List<CitasDTO> buscarCitasPorNombre(String nombre);

    // Buscar citas por estado
    List<CitasDTO> buscarCitasPorEstado(String estado);

    // Buscar citas por fecha
    List<CitasDTO> buscarCitasPorFecha(LocalDate fecha);

    // Buscar citas por matrícula
    List<CitasDTO> buscarCitasPorMatricula(String matricula);
    
    // Buscar citas por talle_id
    List<CitasDTO> buscarCitasPorTallerId(Long tallerId);

}
