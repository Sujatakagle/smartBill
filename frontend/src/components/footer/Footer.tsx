const Footer = () => {
  return (
    <footer className="mt-auto py-3 text-center text-sm text-gray-500 dark:text-gray-400">
      © {new Date().getFullYear()}{" "}
      <span className="font-semibold text-gray-700 dark:text-white">
        Expenzoir
      </span>
      . All rights reserved.
    </footer>
  );
};

export default Footer;
