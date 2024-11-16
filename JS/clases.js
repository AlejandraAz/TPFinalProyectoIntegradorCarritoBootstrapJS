const modal = new bootstrap.Modal(document.getElementById('carritoModal'));
class Producto{
    constructor(nombre,img,stock,precio,codigo,marca,descripcion,cantidad = 1){
        this.nombre = nombre;
        this.img = img;
        this.stock = stock;
        this.precio = precio;
        this.codigo = codigo;
        this.marca = marca;
        this.descripcion = descripcion;
        this.cantidad = cantidad;
    }
};

class ProductoCelular extends Producto{
    constructor(nombre,img,stock,precio,codigo,marca,descripcion,categoria,modelo,pantalla,procesador){
        super(nombre,img,stock,precio,codigo,marca,descripcion)
        this.categoria = 'Celulares';
        this.modelo = modelo; 
        this.pantalla = pantalla; 
        this.procesador = procesador;
    }
}

class Carrito{
    constructor(){
        this.productos = JSON.parse(localStorage.getItem('productos')) || [];
    }

    // agregarProducto(producto) {
    //     const productoExistente = this.productos.find(p => p.codigo === producto.codigo);
    
    //     if (productoExistente) {
    //         productoExistente.cantidad++;
    //     } else {
    //         this.productos.push({ ...producto, cantidad: 1 }); // Añadimos el producto con cantidad 1
    //     }
    
    //     // Guardar en LocalStorage
    //     localStorage.setItem('productos', JSON.stringify(this.productos));
    
    //     this.actualizarCarrito();
    //     this.actualizarContadorProductos();
    // }
    
    agregarProducto(producto) {
        const existe = this.productos.find((p) => p.codigo === producto.codigo);
        if (existe) {
            if (existe.cantidad < existe.stock) {
                existe.cantidad++;
            } else {
                Swal.fire('Stock insuficiente', 'No puedes agregar más de este producto', 'error');
            }
        } else {
            this.productos.push(producto);
        }
        localStorage.setItem('productos', JSON.stringify(this.productos));
        this.actualizarCarrito();
        this.actualizarContadorProductos();
    }

    eliminarProducto(index) {
        if (index >= 0 && index < this.productos.length) {
            Swal.fire({
                title: `¿Deseas eliminar ${this.productos[index].nombre} ${this.productos[index].marca}?`,
                text: "Esta acción no se puede deshacer",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Eliminar',
                cancelButtonText: 'Cancelar',
                reverseButtons: true,
                focusCancel: true,
                customClass: {
                    confirmButton: 'custom-confirm-button', // Aplica la clase para el botón rojo
                    cancelButton: 'btn-secondary' // Puedes usar clases predeterminadas o personalizadas para el botón de cancelar
                }
            }).then((result) => {
                if (result.isConfirmed) {
                    if (this.productos[index].cantidad > 1) {
                        this.productos[index].cantidad--;
                    } else {
                        this.productos.splice(index, 1);
                    }
                    Swal.fire({
                        title: 'Producto actualizado',
                        text: 'El producto fue modificado correctamente',
                        icon: 'success',
                        confirmButtonText: 'Aceptar'
                    });
                    localStorage.setItem('productos', JSON.stringify(this.productos));
                    this.actualizarCarrito();
                    this.actualizarContadorProductos();
                }
            });
        }
    }
    actualizarCarrito() {
        const div_carrito = document.getElementById('carrito');
        const totalProductosSpan = document.getElementById('contador-productos'); // Span para el número de productos
        div_carrito.innerHTML = '';
    
        let total = 0;
        if (this.productos.length === 0) {
            div_carrito.innerHTML = '<p class="text-center fw-bold text-uppercase text-warning-emphasis">No tienes productos añadidos.</p>';
            totalProductosSpan.innerText = '0'; 
        } else {
            this.productos.forEach((prod, index) => {
                total += prod.precio * prod.cantidad;
                let item_carrito = document.createElement('div');
                item_carrito.classList = 'col-12 my-2';
                item_carrito.innerHTML = `
                    <div class="d-flex justify-content-between align-items-center border p-2">
                        <div class="d-flex align-items-center">
                            <img src="${prod.img}" alt="${prod.nombre}" class="img-fluid me-3" style="width: 50px;">
                            <div>
                                <p class="mb-0 text-muted">${prod.marca} - US$ ${prod.precio.toFixed(2)}</p>
                                <label for="cantidad-${index}" class="me-2">Cantidad:</label>
                                <input type="number" id="cantidad-${index}" min="1" max="${prod.stock}" value="${prod.cantidad}" class="form-control form-control-sm cantidad-input" style="width: 70px;">
                            </div>
                        </div>
                        <button class="btn btn-danger btn-sm">Eliminar</button>
                    </div>
                `;
                
                // Escuchar cambios en el input de cantidad
                const inputCantidad = item_carrito.querySelector(`#cantidad-${index}`);
                inputCantidad.addEventListener('change', (e) => {
                    const nuevaCantidad = parseInt(e.target.value);
                    if (nuevaCantidad >= 1 && nuevaCantidad <= prod.stock) {
                        prod.cantidad = nuevaCantidad;
                        localStorage.setItem('productos', JSON.stringify(this.productos));
                        this.actualizarCarrito(); // Recalcula total y actualiza la vista
                    } else {
                        e.target.value = prod.cantidad; // Revertir al valor anterior si no es válido
                    }
                });
    
                const btnEliminar = item_carrito.querySelector('button');
                btnEliminar.addEventListener('click', this.eliminarProducto.bind(this, index));
                div_carrito.appendChild(item_carrito);
            });
    
            totalProductosSpan.innerText = this.productos.length; 
        }
    
        document.getElementById('total').innerText = `Total: US$${total.toFixed(2)}`;
        modal.show();
    }
    

    actualizarContadorProductos() {
        const contador = document.getElementById('contador-productos');
        contador.innerText = this.productos.length;
        // Si el carrito está vacío, ocultamos el contador
        contador.style.display = this.productos.length > 0 ? 'inline' : 'none';
    }
    totalProductos() {
        const total = this.productos.reduce((acum, producto) => {
            return acum + producto.precio;
        }, 0);
        return total;
        }
}




export  { Producto,ProductoCelular,Carrito };