package com.reparacar.repository;

import com.reparacar.entity.Cliente;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface ClienteRepository extends JpaRepository<Cliente, Long> {
	
    List<Cliente> findByNombreContaining(String nombre); // Buscar clientes cuyo nombre contenga un texto
    
    List<Cliente> findByApellidosContaining(String apellidos);
    
    List<Cliente> findByNombreContainingAndApellidosContaining(String nombre, String apellidos);
    
    Optional<Cliente> findByEmailAndPassword(String email, String password); // Buscar cliente por email y contraseña (para login)
}
