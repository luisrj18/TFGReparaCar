package com.reparacar.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.reparacar.dto.LoginDTO;
import com.reparacar.service.ClienteService;

@CrossOrigin(origins = "http://localhost:4200")
@RestController
@RequestMapping("/api/auth")
public class AuthenticationController {
	
	private final ClienteService clienteService;
	public AuthenticationController(ClienteService clienteService) {
		this.clienteService = clienteService;
	}
		
	@PostMapping("/login")
	public ResponseEntity<?> login(@RequestBody LoginDTO request){
		return ResponseEntity.ok((clienteService.login(request)));	
	}
	
}