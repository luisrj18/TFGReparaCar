package com.reparacar.repository;

import com.reparacar.entity.Citas;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface CitasRepository extends JpaRepository<Citas, Long> {
    
    List<Citas> findByNombreContainingIgnoreCase(String nombre);

    List<Citas> findByEstadoIgnoreCase(String estado);

    List<Citas> findByFecha(LocalDate fecha);

    List<Citas> findByMatriculaContainingIgnoreCase(String matricula);

    List<Citas> findByNombreContainingIgnoreCaseAndEstado(String nombre, String estado);
}

