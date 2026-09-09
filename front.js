const API_URL = 'http://localhost:3000/api/productos';

let idProductoEditando = null; 

document.querySelector('form').addEventListener('submit', async (e) => {
    e.preventDefault(); 
    
    const nombre = document.getElementById("nameProd").value;
    const precio = parseFloat(document.getElementById("priceProd").value);
    const cantidad = parseInt(document.getElementById("cantProd").value);

    try {
        let response;

        if (idProductoEditando === null) {
            response = await fetch(API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ nombre, precio, cantidad })
            });
        } else {
            response = await fetch(`${API_URL}/${idProductoEditando}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ nombre, precio, cantidad })
            });
        }

        if (response.ok) {
            alert(idProductoEditando === null ? "¡Producto guardado!" : "¡Producto actualizado!");
            
            e.target.reset(); 
            idProductoEditando = null; 
            document.getElementById("submit-btn").textContent = "Guardar"; 
            listarProductos(); 
        }
    } catch (error) {
        console.error("Error:", error);
    }
});

async function listarProductos() {
    try {
        const response = await fetch(API_URL);
        const productos = await response.json();
        
        const contenedor = document.getElementById('lista-productos');
        if(!contenedor) return; 

        contenedor.innerHTML = ''; 
        
        productos.forEach(prod => {
            contenedor.innerHTML += `
                <div class="box-prod" style="border: solid black; width: 250px; margin: 10px; display: inline-block;">
                    <div class="box-prod-content" style="padding: 10px;">
                        <h4 class="id-prod">ID: ${prod.productoId}</h4>
                        <h4 class="title-prod">Nombre: ${prod.Nombre}</h4>
                        <h4 class="price-prod">Precio: $${prod.Precio}</h4>
                        <h4 class="cant-prod">Cantidad: ${prod.Cantidad}</h4>
                        
                        <button onclick="eliminarProducto(${prod.productoId})">Eliminar</button>
                        <button onclick="prepararEdicion(${prod.productoId}, '${prod.Nombre}', ${prod.Precio}, ${prod.Cantidad})">Editar</button>
                    </div>
                </div>
            `;
        });
    } catch (error) {
        console.error("Error listando:", error);
    }
}

async function eliminarProducto(id) {
    if(!confirm("¿Seguro que deseas eliminar este producto?")) return;

    try {
        const response = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
        if (response.ok) {
            alert("Producto eliminado");
            listarProductos(); 
        }
    } catch (error) {
        console.error("Error eliminando:", error);
    }
}

function prepararEdicion(id, nombre, precio, cantidad) {
    document.getElementById("nameProd").value = nombre;
    document.getElementById("priceProd").value = precio;
    document.getElementById("cantProd").value = cantidad;
    
    idProductoEditando = id; 
    
    document.getElementById("submit-btn").textContent = "Actualizar Producto";
    
    document.querySelector('form').scrollIntoView({ behavior: 'smooth' });
}

document.addEventListener('DOMContentLoaded', listarProductos);