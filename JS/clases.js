const modal = new bootstrap.Modal(document.getElementById('carritoModal'));
class Producto{
    constructor(nombre,categoria,img,stock,precio,codigo,marca,descripcion){
        this.nombre = nombre;
        this.categoria = categoria;
        this.img = img;
        this.stock = stock;
        this.precio = precio;
        this.codigo = codigo;
        this.marca = marca;
        this.descripcion = descripcion;
    }
};


class Carrito{
    constructor(){
        this.productos = JSON.parse(localStorage.getItem('productos')) || [];
    }

    agregarProducto(producto){
        this.productos.push(producto);
        // Guardo en localstorage
        localStorage.setItem('productos',JSON.stringify(this.productos));
        this.actualizarCarrito();
        this.actualizarContadorProductos();
         // Actualizar el contador en el icono
    }

    eliminarProducto(index) {
        if (index >= 0 && index < this.productos.length) {
            // Mostrar confi .-) usando SweetAlert2
            Swal.fire({
                title: `¿Deseas eliminar ${this.productos[index].nombre} ${this.productos[index].marca}?`,
                text: "Esta acción no se puede deshacer",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Eliminar',
                cancelButtonText: 'Cancelar',
                reverseButtons: true,
                focusCancel: true
            }).then((result) => {
                if (result.isConfirmed) {
                    // Si el usuario confirma la eliminación
                    this.productos.splice(index, 1);
                    Swal.fire({
                        title: 'Producto eliminado',
                        text: 'El producto fue eliminado correctamente',
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
            totalProductosSpan.innerText = '0'; // Muestra 0 productos en el icono del carrito
        } else {
            this.productos.forEach((prod, index) => {
                total += prod.precio;
                let item_carrito = document.createElement('div');
                item_carrito.classList = 'col-12 my-2';
                item_carrito.innerHTML = `
                    <div class="d-flex justify-content-between align-items-center border p-2">
                        <div class="d-flex align-items-center">
                            <img src="${prod.img}" alt="${prod.nombre}" class="img-fluid me-3" style="width: 50px;">
                            <div>
                                <p class="mb-0 text-muted">${prod.marca} - US$ ${prod.precio.toFixed(2)}</p>
                            </div>
                        </div>
                        <button class="btn btn-danger btn-sm">Eliminar</button>
                    </div>
                `;
                const btnEliminar = item_carrito.querySelector('button');
                btnEliminar.addEventListener('click', this.eliminarProducto.bind(this, index));
                div_carrito.appendChild(item_carrito);
            });
            totalProductosSpan.innerText = this.productos.length; // Actualiza el número de productos en el icono del carrito
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




export  { Producto,Carrito };