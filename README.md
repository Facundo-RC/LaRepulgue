# La Repulgue 🥟

Simulador de pedidos online para una casa de empanadas.
Proyecto final del curso de JavaScript – Coderhouse.

## Cómo funciona

1. Elegí empanadas del menú (podés filtrar por categoría).
2. Ajustá cantidades o eliminá las que no quieras.
3. Elegí envío a domicilio o retiro en sucursal.
4. Confirmá el pedido.

El pedido se guarda en el navegador, así que no se pierde al recargar.

## Cómo abrirlo

Los datos se cargan con `fetch`, por eso hay que abrirlo desde un servidor:
GitHub Pages o **Live Server** en VS Code. Con doble clic en `index.html` no carga.

## Estructura

```
index.html
assets/   logo e ilustración de la empanada
css/      estilos
data/     empanadas.json y sucursales.json
js/       pedido.js (lógica y storage) · index.js (DOM y eventos)
```

## Consigna

| Requisito | Cómo se cumple |
|---|---|
| **A. DOM** | Menú, pedido y totales se generan con JS. Sin `prompt`, `alert` ni `confirm`. |
| **B. Arrays y objetos** | Menú y sucursales en archivos `.json`, cargados con `fetch`. |
| **C. Orden superior** | `forEach`, `map`, `filter`, `find` y `reduce`. |
| **D. Storage y operadores** | El pedido se guarda, modifica, borra y vacía en `localStorage`. Usa ternario, `\|\|` y destructuring. |
| **E. Asincronismo** | `async/await` con `try/catch/finally`. Si falla la carga, avisa en pantalla. |
| **F. Librerías** | SweetAlert2 para confirmaciones y avisos. |
| **G. Simulador** | Circuito completo: menú → pedido → cantidades → entrega → total → confirmación. |
| **H. Código claro** | Lógica separada del DOM, nombres claros y sin código comentado. |

## Tecnologías

HTML · CSS · JavaScript · Bootstrap 5 · Bootstrap Icons · SweetAlert2

## Autor

Facundo Robaño
