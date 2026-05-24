import { useState, useCallback } from 'react';
import { toast } from 'react-toastify';

const useRedesValidation = (config = {}) => {
  const {
    nameMin = 2,
    nameMax = 60,
    descMin = 10,
    descMax = 1000,
  } = config;

  const isBlank = useCallback((s) => !s || s.trim().length === 0, []);

  const validateNombre = useCallback((value) => {
    const v = (value ?? '').trim();
    if (v.length < nameMin) {
      toast.error(`El nombre debe tener al menos ${nameMin} caracteres.`, { autoClose: 3000 });
      return false;
    }
    if (v.length > nameMax) {
      toast.error(`El nombre no puede superar ${nameMax} caracteres.`, { autoClose: 3000 });
      return false;
    }
    return true;
  }, [nameMin, nameMax]);

  const validateDescripcion = useCallback((value) => {
    const v = (value ?? '').trim();
    if (v.length < descMin) {
      toast.error(`La descripción debe tener al menos ${descMin} caracteres.`, { autoClose: 3000 });
      return false;
    }
    if (v.length > descMax) {
      toast.error(`La descripción no puede superar ${descMax} caracteres.`, { autoClose: 3000 });
      return false;
    }
    return true;
  }, [descMin, descMax]);

  const isNombreValid = useCallback((value) => {
    const v = (value ?? '').trim();
    return v.length >= nameMin && v.length <= nameMax;
  }, [nameMin, nameMax]);

  const isDescripcionValid = useCallback((value) => {
    const v = (value ?? '').trim();
    return v.length >= descMin && v.length <= descMax;
  }, [descMin, descMax]);

  return {
    isBlank,
    validateNombre,
    validateDescripcion,
    isNombreValid,
    isDescripcionValid,
    NAME_MIN: nameMin,
    NAME_MAX: nameMax,
    DESC_MIN: descMin,
    DESC_MAX: descMax,
  };
};

export default useRedesValidation;
