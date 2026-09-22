import { useEffect, useState } from 'react';

type Tema = 'dark' | 'light';

function obtenerTemaInicial(): Tema {
  // Primero respeta la elección guardada por el usuario.
  const guardado = localStorage.getItem('tema') as Tema | null;
  if (guardado === 'dark' || guardado === 'light') return guardado;

  // Si todavía no eligió, usa la preferencia de su sistema operativo.
  const prefiereOscuro = window.matchMedia('(prefers-color-scheme: dark)').matches;
  return prefiereOscuro ? 'dark' : 'light';
}

export function useTema() {
  // La función inicial sólo se consulta al crear el estado.
  const [tema, setTema] = useState<Tema>(obtenerTemaInicial);

  useEffect(() => {
    // La clase controla las variables CSS y localStorage recuerda la elección.
    document.documentElement.classList.toggle('dark', tema === 'dark');
    localStorage.setItem('tema', tema);
  }, [tema]);

  const toggleTema = () => {
    setTema((actual) => (actual === 'dark' ? 'light' : 'dark'));
  };

  return { tema, toggleTema };
}
