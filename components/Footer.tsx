import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-light-blue text-primary-blue text-center p-6 mt-12 border-t border-primary-blue/20">
      <p>&copy; {new Date().getFullYear()} Navalha Digital. Todos os direitos reservados.</p>
      <p className="text-sm mt-1">Sua agenda afiada, seus clientes satisfeitos.</p>
    </footer>
  );
};

export default Footer;