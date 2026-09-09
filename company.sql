PRAGMA foreign_keys = ON;

CREATE TABLE Rol (
    rolId INTEGER PRIMARY KEY AUTOINCREMENT,
    Nombre TEXT NOT NULL,
    Permiso TEXT
);

CREATE TABLE Categoria (
    categoriaId INTEGER PRIMARY KEY AUTOINCREMENT,
    Nombre TEXT NOT NULL,
    Descripcion TEXT
);

CREATE TABLE Usuario (
    usuarioId INTEGER PRIMARY KEY AUTOINCREMENT,
    rolId INTEGER,
    Dni TEXT,
    codigoPostal TEXT,
    Direccion TEXT,
    Nombre TEXT NOT NULL,
    Apellido TEXT NOT NULL,
    Email TEXT,
    FOREIGN KEY (rolId) REFERENCES Rol(rolId)
);

CREATE TABLE Producto (
    productoId INTEGER PRIMARY KEY AUTOINCREMENT,
    categoriaId INTEGER,
    Nombre TEXT NOT NULL,
    Descripcion TEXT,
    Marca TEXT,
    Precio REAL,
    FOREIGN KEY (categoriaId) REFERENCES Categoria(categoriaId)
);

CREATE TABLE Inventario (
    inventarioId INTEGER PRIMARY KEY AUTOINCREMENT,
    productoId INTEGER,
    cantidadInicial INTEGER,
    Entradas INTEGER,
    Salidas INTEGER,
    FOREIGN KEY (productoId) REFERENCES Producto(productoId)
);

CREATE TABLE Venta (
    ventaId INTEGER PRIMARY KEY AUTOINCREMENT,
    vendedorId INTEGER,
    clienteId INTEGER,
    direccionOrigen TEXT,
    direccionDestino TEXT,
    fechaCompra TEXT,        
    fechaAproxEnvio TEXT,
    fechaCompraRecibida TEXT,
    FOREIGN KEY (vendedorId) REFERENCES Usuario(usuarioId),
    FOREIGN KEY (clienteId) REFERENCES Usuario(usuarioId)
);

CREATE TABLE DetalleVenta (
    detalleVentaId INTEGER PRIMARY KEY AUTOINCREMENT,
    ventaId INTEGER,
    productoId INTEGER,
    cantidadProducto INTEGER,
    precioUnitario REAL,
    FOREIGN KEY (ventaId) REFERENCES Venta(ventaId),
    FOREIGN KEY (productoId) REFERENCES Producto(productoId)
);