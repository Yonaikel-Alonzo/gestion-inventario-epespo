
export const normalizarTexto = (s) =>
  (s || "").toString().trim().replace(/\s+/g, " ");

export const normalizarClave = (s) => normalizarTexto(s).toLowerCase();


export const validarTexto = (valor, campo = "campo") => {
  const limpio = normalizarTexto(valor);
  if (!limpio) return `El ${campo} es obligatorio`;
  if (limpio.length < 3) return `El ${campo} debe tener al menos 3 caracteres`;
  if (limpio.length > 255) return `El ${campo} no debe exceder 255 caracteres`;
  if (!/^[a-zA-Z0-9\sáéíóúÁÉÍÓÚñÑ.,\-()]+$/.test(limpio)) {
    return `El ${campo} contiene caracteres no válidos`;
  }

  return null;
};
export const validarNumeroSerie = (valor) => {
  const limpio = normalizarTexto(valor);
  if (!limpio) return "El número de serie es obligatorio";
  if (/\s/.test(limpio)) return "El número de serie no debe contener espacios";
  if (limpio.length < 3)
    return "El número de serie debe tener al menos 3 caracteres";
  if (limpio.length > 60)
    return "El número de serie no debe exceder 60 caracteres";
if (!/^[A-Za-z0-9._/-]+$/.test(limpio)) {

    return "El número de serie contiene caracteres no válidos";
  }
  return null;
};
export const validarNumeroSerieUnico = (
  numeroSerie,
  productos,
  categoria,
  editarId = null
) => {
  const key = normalizarClave(numeroSerie);
  if (!key) return null;

  const existe = (productos || []).some((p) => {
    const mismaCategoria = p.categoria === categoria;
    const mismaSerie = normalizarClave(p.numero_serie) === key;
    const esOtroRegistro = editarId ? p.id !== editarId : true;
    return mismaCategoria && mismaSerie && esOtroRegistro;
  });

  return existe
    ? "Ya existe un bien con ese número de serie en esta categoría"
    : null;
};
export const validarDimensiones = (valor) => {
  const limpio = normalizarTexto(valor);
  const regex = /^\d{1,4}\s*x\s*\d{1,4}$/i;
  if (!limpio) return "Las dimensiones son obligatorias";
  if (!regex.test(limpio)) {
    return 'Las dimensiones deben tener el formato "ALTOxANCHO", por ejemplo 120x60';
  }

  return null;
};
export const validarCategoria = (categoria) => {
  const limpio = normalizarTexto(categoria);
  if (!limpio) return "Debe seleccionar una categoría";
  return null;
};
export const validarFecha = (valor) => {
  if (!valor) return "La fecha de ingreso es obligatoria";
  const fechaIngresada = new Date(valor);
  if (isNaN(fechaIngresada.getTime())) return "La fecha de ingreso no es válida";
  const hoy = new Date();
  const fIng = new Date(
    fechaIngresada.getFullYear(),
    fechaIngresada.getMonth(),
    fechaIngresada.getDate()
  );
  const fHoy = new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate());

  if (fIng > fHoy) return "La fecha de ingreso no puede ser futura";

  return null;
};
export const validarCampoOpcional = (valor, regex, mensaje) => {
  if (!valor) return null;
  if (!regex.test(valor)) return mensaje;
  return null;
};
