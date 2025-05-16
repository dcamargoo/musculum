CREATE DATABASE IF NOT EXISTS musculum;
USE musculum;

CREATE TABLE Usuario (
    id_usuario INT AUTO_INCREMENT PRIMARY KEY,
    nome_usuario VARCHAR(100) NOT NULL,
    data_cadastro DATE NOT NULL,
    idade INT CHECK (idade >= 0),
    peso DECIMAL(5,2) CHECK (peso > 0),
    altura DECIMAL(4,2) CHECK (altura > 0),
    disponibilidade TINYINT CHECK (disponibilidade >= 0),        
    ja_treinou BOOLEAN
);

CREATE TABLE Slot (
    id_slot INT AUTO_INCREMENT PRIMARY KEY,
    treino TEXT NOT NULL,
    objetivo VARCHAR(100),
    avaliacao BOOLEAN,
    data_criacao DATE NOT NULL,
    id_usuario INT,
    FOREIGN KEY (id_usuario) REFERENCES Usuario(id_usuario) ON DELETE CASCADE
);
