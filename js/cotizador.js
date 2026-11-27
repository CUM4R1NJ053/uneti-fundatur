// Dinámico cotizador de 4 paquetes con temporada y descuentos
document.addEventListener('DOMContentLoaded', function() {
  const form = document.getElementById('cotizador-form');
  const resultado = document.getElementById('cotizador-resultado');
  const btnVoucher = document.getElementById('btn-voucher');

  // Datos de los 4 paquetes: { morrocoy-basico, margarita-familiar, merida-aventura, canaima-especial }
  // Precios base por persona (temporada normal)
  const preciosBase = {
    morrocoy-basico: 45,
    margarita-familiar: 160 / 4, // 40 por persona (promedio para 4x3)
    merida-aventura: 185,
    canaima-especial: 200
  };

  // Multiplicadores por temporada
  const multiplicadoresTemporada = {
    normal: 1.0,
    alta: 1.25
  };

  // Descuentos por beneficiario
  const descuentos = {
    estudiante: 0.30,
    publico: 0.20,
    ninguno: 0.0
  };

  // Elementos del formulario
  const paqueteSelect = document.getElementById('cot-paquete');
  const personasInput = document.getElementById('cot-personas');
  const temporadaSelect = document.getElementById('cot-temporada');
  const beneficiarioSelect = document.getElementById('cot-beneficiario');

  // Función de cálculo común
  function calcularCotizacion() {
    const paquete = paqueteSelect.value;
    const personas = parseInt(personasInput.value) || 1;
    const temporada = temporadaSelect.value;
    const beneficiario = beneficiarioSelect.value;

    const precioBase = preciosBase[paquete];
    const multTemporada = multiplicadoresTemporada[temporada];
    const descuento = descuentos[beneficiario];

    // Calcular: (precioBase * multTemporada * (1 - descuento)) * personas
    const precioUnitario = precioBase * multTemporada * (1 - descuento);
    const total = precioUnitario * personas;
    const montoDescuento = precioBase * multTemporada * descuento * personas;

    // Mostrar resultado con desglose
    resultado.innerHTML = `
      <div class="p-4 rounded-xl bg-teal-950/80 border border-teal-500/40 text-center">
        <h3 class="text-teal-300 font-bold text-sm uppercase tracking-wider mb-2">Cotización Completa</h3>
        <div class="space-y-3 text-left max-w-md mx-auto">
          <div class="flex justify-between text-slate-300 text-sm">
            <span>Precio base</span>
            <strong>$${precioBase.toFixed(2)} USD</strong>
          </div>
          <div class="flex justify-between text-slate-300 text-sm">
            <span>Temporada ${temporada === 'alta' ? 'Alta (1.25x)' : 'Normal'}</span>
            <strong>${multTemporada}x</strong>
          </div>
          <div class="flex justify-between text-slate-300 text-sm">
            <span>Descuento ${beneficiario === 'estudiante' ? 'Estudiante (30% off)' : beneficiario === 'publico' ? 'Público (20% off)' : 'Sin descuento'}</span>
            <strong>-$${montoDescuento.toFixed(2)} USD</strong>
          </div>
          <div class="flex justify-between text-amber-300 font-black text-lg">
            <span>Total</span>
            <strong>$${total.toFixed(2)} USD</strong>
          </div>
          <div class="flex justify-between text-slate-300 text-sm">
            <span>Precio unitario</span>
            <strong>$${precioUnitario.toFixed(2)} USD</strong> por persona
          </div>
          <div class="flex justify-between text-slate-300 text-sm">
            <span>Personas</span>
            <strong>${personas}</strong>
          </div>
        </div>
      </div>
    `;
  }

  // Escuchadores de cambio en tiempo real (todos los inputs y selects)
  const elementosCambio = [
    paqueteSelect,
    personasInput,
    temporadaSelect,
    beneficiarioSelect
  ];

  elementosCambio.forEach(el => {
    el.addEventListener('change', calcularCotizacion);
  });

  // Calcular al cargar también
  calcularCotizacion();

  // Botón descargar voucher
  if (btnVoucher) {
    btnVoucher.addEventListener('click', function() {
      const contenido = `COTIZACIÓN FUNDATUR SOCIAL
=====================================

Paquete: Morrocoy - Basico
Personas: 1
Temporada: Normal
Beneficiario: Ninguno

Precio base: $45.00 USD
Temporada: 1.0x
Descuento: 0.00%

Precio unitario: $45.00 USD por persona
Total: $45.00 USD

--- Fin de cotización ---
`;

      const blob = new Blob([contenido], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'voucher-cotizacion-fundatur.txt';
      a.click();
      URL.revokeObjectURL(url);
    });
  }
});